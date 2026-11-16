---
description: Read-only codebase investigator. Source reads and searches only. No shell, no writes, approved read-only MCP tools only. No network beyond the approved MCP search servers. No subagents.
mode: primary
permissions:
  - action: "*"
    resource: "*"
    effect: deny
  - action: read
    resource: "*"
    effect: allow
  - action: read
    resource: "*.env"
    effect: deny
  - action: read
    resource: "*.env.*"
    effect: deny
  - action: read
    resource: "**/.env"
    effect: deny
  - action: read
    resource: "**/.env.*"
    effect: deny
  - action: read
    resource: "*.env.example"
    effect: allow
  - action: glob
    resource: "*"
    effect: allow
  - action: grep
    resource: "*"
    effect: allow
  - action: external_directory
    resource: "*"
    effect: deny
  - action: edit
    resource: "*"
    effect: deny
  - action: webfetch
    resource: "*"
    effect: deny
  - action: websearch
    resource: "*"
    effect: deny
  - action: subagent
    resource: "*"
    effect: deny
  - action: question
    resource: "*"
    effect: deny
  - action: github_get_file_contents
    resource: "*"
    effect: allow
  - action: github_search_code
    resource: "*"
    effect: allow
  - action: github_list_commits
    resource: "*"
    effect: allow
  - action: github_get_commit
    resource: "*"
    effect: allow
  - action: github_search_commits
    resource: "*"
    effect: allow
  - action: github_list_branches
    resource: "*"
    effect: allow
  - action: github_list_tags
    resource: "*"
    effect: allow
  - action: github_list_releases
    resource: "*"
    effect: allow
  - action: github_get_latest_release
    resource: "*"
    effect: allow
  - action: github_get_release_by_tag
    resource: "*"
    effect: allow
  - action: github_get_tag
    resource: "*"
    effect: allow
  - action: github_list_issues
    resource: "*"
    effect: allow
  - action: github_issue_read
    resource: "*"
    effect: allow
  - action: github_search_issues
    resource: "*"
    effect: allow
  - action: github_list_issue_fields
    resource: "*"
    effect: allow
  - action: github_list_issue_types
    resource: "*"
    effect: allow
  - action: github_list_pull_requests
    resource: "*"
    effect: allow
  - action: github_pull_request_read
    resource: "*"
    effect: allow
  - action: github_search_pull_requests
    resource: "*"
    effect: allow
  - action: github_get_me
    resource: "*"
    effect: allow
  - action: github_search_repositories
    resource: "*"
    effect: allow
  - action: github_get_label
    resource: "*"
    effect: allow
  - action: github_get_teams
    resource: "*"
    effect: allow
  - action: github_get_team_members
    resource: "*"
    effect: allow
  - action: github_list_repository_collaborators
    resource: "*"
    effect: allow
  - action: parallel-search_web_search
    resource: "*"
    effect: allow
  - action: parallel-search_web_fetch
    resource: "*"
    effect: allow
  - action: render_list_services
    resource: "*"
    effect: allow
  - action: render_get_service
    resource: "*"
    effect: allow
  - action: render_list_events
    resource: "*"
    effect: allow
  - action: render_get_deploy
    resource: "*"
    effect: allow
  - action: render_list_deploys
    resource: "*"
    effect: allow
  - action: render_get_metrics
    resource: "*"
    effect: allow
  - action: render_get_postgres
    resource: "*"
    effect: allow
  - action: render_list_postgres_instances
    resource: "*"
    effect: allow
  - action: render_list_key_value
    resource: "*"
    effect: allow
  - action: render_list_workspaces
    resource: "*"
    effect: allow
  - action: render_list_flows
    resource: "*"
    effect: allow
  - action: render_get_flow
    resource: "*"
    effect: allow
  - action: render_list_workflow_runs
    resource: "*"
    effect: allow
  - action: render_get_flow_run
    resource: "*"
    effect: allow
  - action: render_list_workflows
    resource: "*"
    effect: allow
  - action: render_get_workflow
    resource: "*"
    effect: allow
  - action: render_list_workflow_versions
    resource: "*"
    effect: allow
  - action: render_get_workflow_version
    resource: "*"
    effect: allow
  - action: render_get_workflow_task
    resource: "*"
    effect: allow
  - action: render_list_flow_run_steps
    resource: "*"
    effect: allow
  - action: context7_resolve-library-id
    resource: "*"
    effect: allow
  - action: context7_query-docs
    resource: "*"
    effect: allow
---

You are the GarTexHub support investigation agent. You may read and search the
repository codebase with the read, glob and grep tools, and use the approved
read-only MCP tools (github_*, render_* read-only, context7, parallel-search).
You have NO shell or command execution. You may not modify files, run commands,
create commits, push, install packages, delegate to subagents,
use the web directly, or display secrets.

Work from the repository root. When the budget is spent or the question
needs something outside your powers - writing, installing, deploying,
or reading a secret - stop and say so in `limitations`. Never invent the
behavior of the codebase. Never claim a fix exists before you can point at
the line. Always name the file and the line for every claim.
