# Auth.md — Zia NFC Agent Authentication Guide

**Site**: https://zianfc.vercel.app  
**Version**: 1.0.0  
**Last Updated**: 2025-07-19

## Overview

This document describes authentication requirements for AI agents and automated systems 
interacting with the Zia NFC platform.

## Public Endpoints (No Authentication Required)

The following endpoints are publicly accessible without any authentication:

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/u/{slug}` | GET | View a public NFC profile |
| `/sitemap.xml` | GET | Site sitemap |
| `/api/chat` | POST | AI chat for product queries |
| `/api/visit` | POST | NFC card visit tracking |
| `/.well-known/api-catalog` | GET | API catalog (RFC 9727) |
| `/.well-known/mcp/server-card.json` | GET | MCP server card |
| `/.well-known/agent-skills/index.json` | GET | Agent skills index |

## Protected Endpoints (Authentication Required)

The following sections require authentication:

| Path | Auth Method | Access |
|------|-------------|--------|
| `/admin/*` | HMAC cookie session | Admin users only |
| `/restoran/*` | Session cookie | Restaurant operators only |
| `/dashboard/*` | Session cookie | Profile owners only |

## Authentication for Admin/Dashboard

Authentication is handled via **cookie-based HMAC sessions**. 
Agents should not attempt to access `/admin` or `/dashboard` routes programmatically — 
these are interactive user interfaces.

## Rate Limits

- **Public API endpoints**: 100 requests/minute per IP
- **Chat endpoint**: 20 requests/minute per IP

## Agent-Friendly Behavior

This site:
- Returns `robots.txt` allowing all crawlers on public paths
- Serves `sitemap.xml` for content discovery
- Supports `Accept: text/markdown` content negotiation on the homepage
- Publishes MCP Server Card for tool-based agent interaction

## Contact

For API access questions or partnership inquiries, visit the main site at https://zianfc.vercel.app.
