# Auth.md — Zia NFC Agent Authentication Guide

This service supports agentic authentication via the [auth.md](https://github.com/workos/auth.md) protocol.

- **Resource Server**: `https://zianfc.vercel.app`
- **Authorization Server**: `https://zianfc.vercel.app`

---

## Step 1: Discover Protected Resource Metadata

Fetch the protected resource metadata to determine the authorization server(s):

```http
GET /.well-known/oauth-protected-resource HTTP/1.1
Host: zianfc.vercel.app
Accept: application/json
```

## Step 2: Agent Registration

Most endpoints on this platform are **publicly accessible** without registration.

### Agent Registration Details

- **register_uri**: `https://zianfc.vercel.app/api/agents/register`
- **identity_types**: `anonymous`, `oidc_token`
- **credential_types**: `none`, `bearer`
- **scopes_supported**: `read:profiles`, `read:menus`

### Public Endpoints (No Registration Required)

| Endpoint | Method | Scope |
|----------|--------|-------|
| `/u/{slug}` | GET | public |
| `/api/chat` | POST | public |
| `/api/visit` | POST | public |
| `/.well-known/api-catalog` | GET | public |
| `/.well-known/mcp/server-card.json` | GET | public |
| `/.well-known/agent-skills/index.json` | GET | public |
| `/sitemap.xml` | GET | public |

### Protected Endpoints

| Endpoint | Method | Required Scope |
|----------|--------|----------------|
| `/admin/*` | ALL | admin session |
| `/restoran/*` | ALL | operator session |
| `/dashboard/*` | ALL | user session |

## Step 3: Making Requests

For public endpoints, no authentication is needed:

```http
GET /u/example-slug HTTP/1.1
Host: zianfc.vercel.app
Accept: application/json
```

For the AI chat endpoint:

```http
POST /api/chat HTTP/1.1
Host: zianfc.vercel.app
Content-Type: application/json

{"message": "Tell me about Zia NFC products"}
```

## Step 4: Rate Limits

- Public endpoints: 100 requests/minute per IP
- Chat endpoint: 20 requests/minute per IP
- On rate limit, the server returns `429 Too Many Requests`

---

*Zia NFC — https://zianfc.vercel.app*
