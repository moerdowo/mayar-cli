.PHONY: help version-patch version-minor version-major publish release-patch release-minor release-major

VERSION := $(shell node -p "require('./package.json').version")

help:
	@echo "Usage: make <target>"
	@echo ""
	@echo "  version-patch   Bump patch version (x.y.Z), commit & tag"
	@echo "  version-minor   Bump minor version (x.Y.0), commit & tag"
	@echo "  version-major   Bump major version (X.0.0), commit & tag"
	@echo "  publish         npm publish (current version)"
	@echo "  release-patch   version-patch + publish + git push"
	@echo "  release-minor   version-minor + publish + git push"
	@echo "  release-major   version-major + publish + git push"

version-patch:
	npm version patch --no-git-tag-version
	$(eval NEW_VERSION := $(shell node -p "require('./package.json').version"))
	git add package.json
	git commit -m "Release v$(NEW_VERSION)"
	git tag v$(NEW_VERSION)

version-minor:
	npm version minor --no-git-tag-version
	$(eval NEW_VERSION := $(shell node -p "require('./package.json').version"))
	git add package.json
	git commit -m "Release v$(NEW_VERSION)"
	git tag v$(NEW_VERSION)

version-major:
	npm version major --no-git-tag-version
	$(eval NEW_VERSION := $(shell node -p "require('./package.json').version"))
	git add package.json
	git commit -m "Release v$(NEW_VERSION)"
	git tag v$(NEW_VERSION)

publish:
	npm publish --access public

release-patch: version-patch publish
	git push origin main --tags

release-minor: version-minor publish
	git push origin main --tags

release-major: version-major publish
	git push origin main --tags
