#!/usr/bin/env python3

import click
import json
from subprocess import CalledProcessError, run


@click.command()
@click.option("--bump-major", "-M", is_flag=True)
@click.option("--bump-minor", "-m", is_flag=True)
@click.option("--bump-patch", "-p", is_flag=True)
@click.option("--push", is_flag=True)
def main(bump_major, bump_minor, bump_patch, push):
    with open("package.json", "rb") as fp:
        package = json.load(fp)
    version = package["version"]
    print(f"Current: {version}")
    [major, minor, patch] = version.split(".")
    next_version = ""
    if bump_major:
        next_version = f"{int(major)+1}.0.0"
    if bump_minor:
        next_version = f"{major}.{int(minor)+1}.0"
    if bump_patch:
        next_version = f"{major}.{minor}.{int(patch)+1}"
    if next_version:
        print(f"Bump to: {next_version}")
        package["version"] = next_version
        with open("package.json", "w") as fp:
            json.dump(package, fp, ensure_ascii=True, indent=2)
        run(["prettier", "-w", "package.json"])

        if push:
            run(["git", "add", "package.json"], check=True)
            run(["git", "config", "user.email", "ylilarry@gmail.com"], check=True)
            run(["git", "config", "user.name", "Yu Li"], check=True)
            run(
                ["git", "commit", "-m", f"Bump version: {version} -> {next_version}"],
                check=True,
            )
            src_branch = f"bump-to-{next_version}"
            print("Input your github token:")
            print("> ", end="", flush=True)
            run(["gh", "auth", "login", "--with-token"], check=True)
            run(["git", "push", "origin", f"HEAD:{src_branch}"])
            run(
                [
                    "gh",
                    "pr",
                    "create",
                    "--base",
                    "staging",
                    "--head",
                    src_branch,
                    "--title",
                    f"staging <- {src_branch}: bump version from {version}",
                    "--body",
                    "",
                ]
            )


if __name__ == "__main__":
    try:
        main()
    except CalledProcessError as err:
        exit(err.stdout + err.stderr)
