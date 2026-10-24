#!/usr/bin/env bash
# Проверяет, что текущая ветка не отстаёт от GitHub и содержит origin/main.
# Коды выхода: 0 ок, 1 сбой git, 2 detached, 4 diverged, 5 behind, 6 нет последних коммитов main.
set -euo pipefail

cd "$(git rev-parse --show-toplevel)"

if ! git fetch origin --prune; then
  echo "FETCH_FAILED: не удалось получить состояние GitHub (origin)."
  exit 1
fi

if ! git rev-parse --verify --quiet origin/main >/dev/null; then
  echo "NO_MAIN: на origin нет ветки main."
  exit 1
fi

branch="$(git branch --show-current || true)"
if [[ -z "${branch}" ]]; then
  echo "DETACHED: HEAD не на ветке ($(git rev-parse --short HEAD)). Переключитесь на ветку, прежде чем править файлы."
  exit 2
fi

upstream="$(git rev-parse --abbrev-ref --symbolic-full-name '@{upstream}' 2>/dev/null || true)"

contains_main=0
if git merge-base --is-ancestor origin/main HEAD; then
  contains_main=1
fi

if [[ -n "${upstream}" ]]; then
  read -r behind ahead < <(git rev-list --left-right --count "${upstream}...HEAD")
  echo "branch=${branch} upstream=${upstream} behind=${behind} ahead=${ahead} contains_origin_main=${contains_main}"
  if [[ "${behind}" -gt 0 && "${ahead}" -gt 0 ]]; then
    echo "DIVERGED: ${branch} и ${upstream} разошлись (отстаёт на ${behind}, впереди на ${ahead})."
    exit 4
  fi
  if [[ "${behind}" -gt 0 ]]; then
    echo "BEHIND: ${branch} отстаёт от ${upstream} на ${behind} коммит(ов)."
    exit 5
  fi
else
  echo "branch=${branch} upstream=none contains_origin_main=${contains_main}"
fi

if [[ "${contains_main}" -ne 1 ]]; then
  echo "STALE_BASE: в ${branch} нет последних коммитов origin/main."
  exit 6
fi

if [[ -z "${upstream}" ]]; then
  echo "OK: ${branch} содержит origin/main и ещё не связана с удалённой веткой."
else
  echo "OK: ${branch} не отстаёт от ${upstream} и содержит origin/main."
fi
exit 0
