> 🌐 **English** · [Español](checklist-ambiente.md)

# ✅ Environment checklist (Lab 0)

Check off each item. When they're all ✅, you unlock the 🧰 *Kit Ready* badge (+30 XP).

## Installed tools

- [ ] `git --version` responds
- [ ] `docker --version` responds
- [ ] `docker info` responds (the **daemon** is running, not just the client)
- [ ] `node --version` shows v20 or higher
- [ ] `npm --version` responds

## For Kubernetes (days 3-4)

- [ ] `kubectl version --client` responds
- [ ] `helm version` responds
- [ ] `kind --version` responds

## Trial by fire (the app runs on your machine)

- [ ] `cd 01-app/node && npm install` finishes without errors
- [ ] `npm test` shows **8/8** tests passing
- [ ] `npm start` and then `curl http://localhost:8080/health` returns `"status":"UP"`

## Docker trial by fire

- [ ] `docker build -t academia-devops-app:1.0.0 .` builds the image
- [ ] `docker run -d -p 8080:8080 academia-devops-app:1.0.0` brings up the container
- [ ] `curl http://localhost:8080/health` responds

> Something failing? → [`troubleshooting.en.md`](troubleshooting.en.md)
