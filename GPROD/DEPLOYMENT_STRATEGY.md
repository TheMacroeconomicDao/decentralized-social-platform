# 🚀 GPROD Deployment Strategy

## 📊 Environment Matrix

| Environment | Repository | Branch | Namespace | Domain | Status |
|-------------|------------|--------|-----------|---------|--------|
| **Development** | backend repo | `dev` | `develop-gprod` | `api.dev.gprod.build.infra.gyber.org` | ✅ ACTIVE |
| **Staging** | monorepo | `stage` | `stage-gprod` | `api.stage.gprod.build.infra.gyber.org` | 🔄 PLANNED |
| **Production** | monorepo | `main` | `prod-gprod` | `api.gprod.build.infra.gyber.org` | 🔄 PLANNED |

## ⚠️ Conflict Prevention

### 1. **Repository Separation**
- **Legacy Backend**: Continues `dev` → `develop-gprod` deployments
- **Monorepo**: New `main` → `prod-gprod` and `stage` → `stage-gprod`

### 2. **Docker Image Tags**
```bash
# Legacy (backend repo)
ghcr.io/themacroeconomicdao/gprod-backend:dev

# Monorepo  
ghcr.io/themacroeconomicdao/gprod-backend:latest   # production
ghcr.io/themacroeconomicdao/gprod-backend:stage    # staging
```

### 3. **Branch Protection Rules**

#### Backend Repository:
- `main` branch: PROTECTED - only monorepo updates
- `dev` branch: For legacy development
- No direct pushes to `main` from development

#### Monorepo:
- `main` branch: Production releases only
- `stage` branch: Staging deployments  
- `dev` branch: Development (no auto-deploy)

## 🔄 Migration Path

### Phase 1: Parallel Operation (Current)
- ✅ Keep `develop-gprod` running (dev environment)
- ✅ Deploy `prod-gprod` and `stage-gprod` via monorepo
- ✅ Test monorepo CI/CD thoroughly

### Phase 2: Gradual Migration
- 🔄 Move development to monorepo `dev` branch
- 🔄 Update team workflows
- 🔄 Deprecate backend repo pipeline

### Phase 3: Full Monorepo
- 🎯 All environments managed via monorepo
- 🎯 Backend repo becomes archive/submodule only

## 🛠️ Operational Guidelines

### For Development:
1. **Quick fixes**: Use backend repo `dev` branch
2. **New features**: Use monorepo development workflow
3. **Testing**: Use monorepo `stage` branch

### For Production:
1. **All production deploys**: Via monorepo `main` branch only
2. **No direct backend repo production deploys**
3. **Staging validation required** before production

### For Hotfixes:
1. **Critical issues**: Backend repo `dev` → `develop-gprod`
2. **Production issues**: Monorepo hotfix branch → `main`

## 🔍 Monitoring & Alerts

- **Namespace separation** prevents resource conflicts
- **Different domains** prevent routing conflicts  
- **Separate Docker tags** prevent image conflicts
- **Branch protection** prevents accidental deploys

## 📞 Troubleshooting

### If pipelines conflict:
1. Check which pipeline triggered first
2. Cancel conflicting pipeline
3. Verify target namespace is correct
4. Check Docker image tags

### If deployments fail:
1. Verify namespace exists
2. Check TLS certificates
3. Validate Kubernetes configs
4. Review pipeline logs

---

**Last Updated**: 2025-07-06  
**Next Review**: 2025-07-20 