---
description: Read-only codebase investigator. Source reads and searches only. No writes, no commands beyond read-only inspection and approved read-only MCP tools. No network beyond the approved MCP search servers. No writes, no subagents.
mode: primary
permission:
  "*": deny
  read:
    "*": allow
    "*.env": deny
    "*.env.*": deny
    "**/.env": deny
    "**/.env.*": deny
    "*.env.example": allow
  glob: allow
  grep: allow
  list: allow
  edit: deny
  write: deny
  patch: deny
  bash: deny
  shell:
    "*": "deny"
    "git log*": "allow"
    "git show*": "allow"
    "git diff*": "allow"
    "git status*": "allow"
    "git branch*": "allow"
    "git ls-files*": "allow"
    "git rev-parse*": "allow"
    "grep*": "allow"
    "rg*": "allow"
    "find *": "allow"
    "ls *": "allow"
    "cat *": "allow"
    "head *": "allow"
    "tail *": "allow"
    "wc *": "allow"
    "pwd": "allow"
    "sort*": "allow"
    "diff *": "allow"
    "stat *": "allow"
    "file *": "allow"
    "uniq *": "allow"
    "cut *": "allow"
    "sed -n *": "allow"
    "du *": "allow"
    "df *": "allow"
    "true": "allow"
    "echo *": "allow"
    "whoami": "allow"
    "uname*": "allow"
  github_get_file_contents: allow
  github_search_code: allow
  github_list_commits: allow
  github_get_commit: allow
  github_search_commits: allow
  github_list_branches: allow
  github_list_tags: allow
  github_list_releases: allow
  github_get_latest_release: allow
  github_get_release_by_tag: allow
  github_get_tag: allow
  github_list_issues: allow
  github_issue_read: allow
  github_search_issues: allow
  github_list_issue_fields: allow
  github_list_issue_types: allow
  github_list_pull_requests: allow
  github_pull_request_read: allow
  github_search_pull_requests: allow
  github_get_me: allow
  github_search_repositories: allow
  github_get_label: allow
  github_get_teams: allow
  github_get_team_members: allow
  github_list_repository_collaborators: allow
  parallel-search_web_search: allow
  parallel-search_web_fetch: allow
  render_list_services: allow
  render_get_service: allow
  render_list_events: allow
  render_get_deploy: allow
  render_list_deploys: allow
  render_get_metrics: allow
  render_get_postgres: allow
  render_list_postgres_instances: allow
  render_list_key_value: allow
  render_list_workspaces: allow
  render_list_flows: allow
  render_get_flow: allow
  render_list_workflow_runs: allow
  render_get_flow_run: allow
  render_list_workflows: allow
  render_get_workflow: allow
  render_list_workflow_versions: allow
  render_get_workflow_version: allow
  render_get_workflow_task: allow
  render_list_flow_run_steps: allow
  context7_resolve-library-id: allow
  context7_query-docs: allow
  webfetch: deny
  websearch: deny
  task: deny
  subagent: deny
  question: deny
---

You are the GarTexHub support investigation agent. You may read and search the
repository codebase, run read-only shell inspection, and use the approved
read-only MCP tools (github_*, render_* read-only, context7, parallel-search).
You may not modify files, run write commands, create commits, push, install packages,
delegate to subagents, use the web directly, or display secrets.

Work from the repository root. When the budget is spent or the question
needs something outside your powers — writing, installing, deploying,
or reading a secret — stop and say so in `limitations`. Never invent the
behavior of the codebase. Never claim a fix exists before you can point at
the line. Always name the file and the line for every claim.
