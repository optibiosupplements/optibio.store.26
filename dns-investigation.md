# DNS Investigation Report - optibiosupplements.com

## Date: January 20, 2026

## Current DNS Configuration

### Nameservers (GoDaddy)
- ns25.domaincontrol.com
- ns26.domaincontrol.com

These are GoDaddy's default nameservers, confirming the domain is registered with GoDaddy.

### A Records
| Domain | IP Address | Provider |
|--------|------------|----------|
| optibiosupplements.com | 104.18.26.246 | Cloudflare |
| optibiosupplements.com | 104.18.27.246 | Cloudflare |
| www.optibiosupplements.com | (none) | Not configured |

### CNAME Records
| Domain | Points To |
|--------|-----------|
| www.optibiosupplements.com | (none) | Not configured |

### Other Records
- **TXT**: MS=ms22334708 (Microsoft verification)
- **TXT**: v=spf1 include:spf.protection.outlook.com -all (Email SPF)
- **MX**: optibiosupplements-com.mail.protection.outlook.com (Microsoft 365 email)

## Key Findings

### 1. Domain IS Live and Working
- https://optibiosupplements.com returns HTTP 200
- Content is loading (OptiBio Ashwagandha page)
- SSL certificate is active (via Cloudflare)

### 2. IP Address Mismatch
| Service | IP Address |
|---------|------------|
| optibiosupplements.com | 104.18.26.246, 104.18.27.246 (Cloudflare) |
| Manus dev server | 34.110.191.241 (Google Cloud) |

**The domain is pointing to Cloudflare, NOT directly to Manus.**

### 3. www Subdomain Not Configured
- www.optibiosupplements.com has no A or CNAME record
- This may cause "Server Not Found" for users typing www

## Conclusion

The domain optibiosupplements.com is live and serving the OptiBio website through Cloudflare. However:

1. The Manus UI may not show the domain because it's proxied through Cloudflare
2. The www subdomain needs to be configured
3. There may be a separate Cloudflare account managing this domain

## Recommended Actions

1. Check if there's a Cloudflare account connected to this domain
2. Add www CNAME record pointing to optibiosupplements.com
3. Verify the Cloudflare-to-Manus connection is properly configured
