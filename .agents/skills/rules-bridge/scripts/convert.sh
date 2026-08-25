#!/usr/bin/env bash
# scripts/convert.sh
# Converts AGENTS.md to the native rule format of each supported AI tool.
# Also syncs .agents/instructions/ → .github/instructions/ for fine-grained rules,
# and mirrors .github/agents/ + .github/skills/ → .agents/agents/ + .agents/skills/
# so Codex can consume the same repo-local guidance.
#
# Usage:
#   bash scripts/convert.sh [copilot|cursor|codex|antigravity|all]
#
# Targets:
#   copilot      → .github/copilot-instructions.md  (plain Markdown copy)
#                  .github/instructions/             (sync from .agents/instructions/)
#                  .agents/agents/                   (mirror from .github/agents/)
#                  .agents/skills/                   (mirror from .github/skills/)
#   cursor       → .cursor/rules/base.mdc            (.mdc with YAML frontmatter)
#   codex        → AGENTS.md                         (verify only; natively supported)
#                  .agents/instructions/             (verify only; Codex reads natively)
#                  .agents/agents/                   (verify only; Codex reads natively)
#                  .agents/skills/                   (verify only; Codex reads natively)
#   antigravity  → .agents/AGENTS.md                 (project-scoped rules for Antigravity)
#                  .agents/instructions/             (mirror from .github/instructions/)
#                  .agents/agents/                   (mirror from .github/agents/)
#                  .agents/skills/                   (mirror from .github/skills/)
#   all          → all four targets above            (default)

set -euo pipefail

# ---------------------------------------------------------------------------
# Helpers
# ---------------------------------------------------------------------------

SOURCE_FILE="AGENTS.md"
AGENTS_INSTRUCTIONS_DIR=".agents/instructions"
AGENTS_AGENTS_DIR=".agents/agents"
AGENTS_SKILLS_DIR=".agents/skills"
GITHUB_INSTRUCTIONS_DIR=".github/instructions"
GITHUB_AGENTS_DIR=".github/agents"
GITHUB_SKILLS_DIR=".github/skills"

info()    { echo "$*"; }
success() { echo "✅ $*"; }
failure() { echo "❌ $*"; }

# ---------------------------------------------------------------------------
# Check that the source file exists
# ---------------------------------------------------------------------------

if [[ ! -f "${SOURCE_FILE}" ]]; then
  failure "Source file '${SOURCE_FILE}' not found in the current directory ($(pwd))."
  echo "   Please run this script from the project root, or create an AGENTS.md file first."
  exit 1
fi

# ---------------------------------------------------------------------------
# Shared: sync .agents/instructions/ → target instructions dir
# ---------------------------------------------------------------------------

# Sync .md files from a source dir to a target dir (flat)
sync_files_to() {
  local label="$1"
  local src_dir="$2"
  local target_dir="$3"

  if [[ ! -d "${src_dir}" ]]; then
    info "   (no ${src_dir}/ found — skipping ${label} sync)"
    return 0
  fi

  if ! mkdir -p "${target_dir}"; then
    failure "${label} → Failed to create directory '${target_dir}'"
    return 1
  fi

  local count=0
  for src_file in "${src_dir}"/*.md; do
    [[ -f "${src_file}" ]] || continue
    local filename
    filename="$(basename "${src_file}")"
    cp "${src_file}" "${target_dir}/${filename}"
    ((count++)) || true
  done

  if [[ ${count} -gt 0 ]]; then
    success "${label} → ${target_dir}/ (${count} files synced)"
  else
    info "   (no .md files in ${src_dir}/ — nothing synced)"
  fi
}

# Sync skill folders (each skill is a directory with SKILL.md inside)
sync_skills_to() {
  local src_dir="$1"
  local target_dir="$2"

  if [[ ! -d "${src_dir}" ]]; then
    info "   (no ${src_dir}/ found — skipping skills sync)"
    return 0
  fi

  if ! mkdir -p "${target_dir}"; then
    failure "skills → Failed to create directory '${target_dir}'"
    return 1
  fi

  local count=0
  for skill_dir in "${src_dir}"/*/; do
    [[ -d "${skill_dir}" ]] || continue
    local skill_name
    skill_name="$(basename "${skill_dir}")"
    local dest="${target_dir}/${skill_name}"
    mkdir -p "${dest}"
    cp -r "${skill_dir}." "${dest}/"
    ((count++)) || true
  done

  if [[ ${count} -gt 0 ]]; then
    success "skills    → ${target_dir}/ (${count} skill folders synced)"
  else
    info "   (no skill folders in ${src_dir}/ — nothing synced)"
  fi
}

sync_instructions_to() { sync_files_to "instructions" "${AGENTS_INSTRUCTIONS_DIR}" "$1"; }

# ---------------------------------------------------------------------------
# Conversion functions
# ---------------------------------------------------------------------------

convert_copilot() {
  local dest_dir=".github"
  local dest_file="${dest_dir}/copilot-instructions.md"

  if mkdir -p "${dest_dir}" && cp "${SOURCE_FILE}" "${dest_file}"; then
    success "copilot  → ${dest_file}"
  else
    failure "copilot  → Failed to write '${dest_file}'"
    return 1
  fi

  # Sync fine-grained instructions to GitHub, then mirror GitHub agent metadata back to Codex folders
  sync_instructions_to "${GITHUB_INSTRUCTIONS_DIR}"
  sync_files_to "agents mirror" "${GITHUB_AGENTS_DIR}" "${AGENTS_AGENTS_DIR}"
  sync_skills_to "${GITHUB_SKILLS_DIR}" "${AGENTS_SKILLS_DIR}"
}

convert_cursor() {
  local dest_dir=".cursor/rules"
  local dest_file="${dest_dir}/base.mdc"

  if ! mkdir -p "${dest_dir}"; then
    failure "cursor   → Failed to create directory '${dest_dir}'"
    return 1
  fi

  # Write .mdc file with required YAML frontmatter
  {
    echo "---"
    echo "alwaysApply: true"
    echo "---"
    echo ""
    cat "${SOURCE_FILE}"
  } > "${dest_file}"

  if [[ $? -eq 0 ]]; then
    success "cursor   → ${dest_file}"
  else
    failure "cursor   → Failed to write '${dest_file}'"
    return 1
  fi
}

convert_codex() {
  # Codex CLI reads AGENTS.md natively — just verify it exists.
  if [[ -f "${SOURCE_FILE}" ]]; then
    success "codex    → ${SOURCE_FILE} (present; Codex CLI reads it natively)"
  else
    failure "codex    → '${SOURCE_FILE}' not found"
    return 1
  fi

  # Verify .agents/instructions/ exists
  if [[ -d "${AGENTS_INSTRUCTIONS_DIR}" ]]; then
    local count
    count=$(find "${AGENTS_INSTRUCTIONS_DIR}" -maxdepth 1 -name "*.md" | wc -l | tr -d ' ')
    success "codex    → ${AGENTS_INSTRUCTIONS_DIR}/ (${count} instruction files; read natively)"
  else
    info "   (no .agents/instructions/ — consider running 'rules-bridge copilot' first)"
  fi

  # Verify .agents/agents/ exists
  if [[ -d "${AGENTS_AGENTS_DIR}" ]]; then
    local acount
    acount=$(find "${AGENTS_AGENTS_DIR}" -maxdepth 1 -name "*.md" | wc -l | tr -d ' ')
    success "codex    → ${AGENTS_AGENTS_DIR}/ (${acount} agent files; read natively)"
  else
    info "   (no .agents/agents/ — consider running 'rules-bridge copilot' first)"
  fi

  # Verify .agents/skills/ exists
  if [[ -d "${AGENTS_SKILLS_DIR}" ]]; then
    local scount
    scount=$(find "${AGENTS_SKILLS_DIR}" -maxdepth 1 -mindepth 1 -type d | wc -l | tr -d ' ')
    success "codex    → ${AGENTS_SKILLS_DIR}/ (${scount} skill folders; read natively)"
  else
    info "   (no .agents/skills/ — consider running 'rules-bridge copilot' first)"
  fi
}

convert_antigravity() {
  local dest_dir=".agents"
  local dest_file="${dest_dir}/AGENTS.md"

  if mkdir -p "${dest_dir}" && cp "${SOURCE_FILE}" "${dest_file}"; then
    success "antigravity -> ${dest_file}"
  else
    failure "antigravity -> Failed to write '${dest_file}'"
    return 1
  fi

  # Mirror github folders to agents folders
  sync_files_to "instructions mirror" "${GITHUB_INSTRUCTIONS_DIR}" "${AGENTS_INSTRUCTIONS_DIR}"
  sync_files_to "agents mirror" "${GITHUB_AGENTS_DIR}" "${AGENTS_AGENTS_DIR}"
  sync_skills_to "${GITHUB_SKILLS_DIR}" "${AGENTS_SKILLS_DIR}"
}

# ---------------------------------------------------------------------------
# Main
# ---------------------------------------------------------------------------

TARGET="${1:-all}"

case "${TARGET}" in
  copilot)
    convert_copilot
    ;;
  cursor)
    convert_cursor
    ;;
  codex)
    convert_codex
    ;;
  antigravity)
    convert_antigravity
    ;;
  all)
    info "Syncing rules to all supported tools..."
    errors=0
    convert_copilot || ((errors++)) || true
    convert_cursor  || ((errors++)) || true
    convert_codex   || ((errors++)) || true
    convert_antigravity || ((errors++)) || true
    echo ""
    if [[ ${errors} -eq 0 ]]; then
      success "All targets synced successfully."
    else
      failure "${errors} target(s) failed. See messages above."
      exit 1
    fi
    ;;
  *)
    failure "Unknown target: '${TARGET}'"
    echo "   Valid targets: copilot, cursor, codex, antigravity, all"
    exit 1
    ;;
esac
