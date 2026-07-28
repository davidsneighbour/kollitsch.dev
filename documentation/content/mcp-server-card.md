---
title: MCP Server Card assessment
tags: []
created: 2026-07-28T00:00:00+07:00
updated: 2026-07-28T00:00:00+07:00
---

KOLLITSCH.dev does not publish an MCP Server Card at
`/.well-known/mcp/server-card.json`.

## Current decision

Do not publish MCP Server Card metadata. The website does not expose a Model
Context Protocol server, streamable HTTP endpoint, SSE transport, JSON-RPC tool
surface, resource list, prompt list, or MCP authentication model. Publishing a
server card without a real endpoint would advertise capabilities that do not
exist.

The current MCP Server Card proposal is also still draft work. The linked MCP
repository discussion for SEP-2127 remains open as of 2026-07-28, so this site
must not treat the schema or well-known path as stable project infrastructure.

## Future publication requirements

Only publish an MCP Server Card when this domain intentionally serves or
delegates to a real MCP server. At that point, the card must include truthful
metadata for:

* server identity and human-readable description,
* supported MCP protocol versions,
* real remote transport endpoints,
* authentication requirements,
* capabilities, tools, resources, and prompts that the server actually exposes,
* the schema version in force at implementation time.

If the eventual standard uses a different path or pluralised catalogue format,
follow the accepted standard rather than this draft issue's placeholder path.

## References

* [SEP-2127 MCP Server Cards discussion](https://github.com/modelcontextprotocol/modelcontextprotocol/pull/2127)
