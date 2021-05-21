#!/usr/bin/env python3

import click
from subprocess import CalledProcessError, run


@click.command()
@click.option("--head", required=True, type=str)
@click.option("--title", required=True, type=str)
@click.option("--base", required=True, type=str)
@click.option("--body", required=True, type=str)
@click.option("--repo", required=True, type=str)
def main(head, base, title, body, repo):
    token = input("Input your github token:\n> ")
    run(["gh", "auth", "login", "--with-token"], check=True, input=token, text=True)
    create_pr = run(
        [
            "gh",
            "pr",
            "create",
            "--repo",
            repo,
            "--base",
            base,
            "--head",
            head,
            "--title",
            title,
            "--body",
            body,
        ]
    )
    if create_pr.returncode != 0:
        run(["gh", "pr", "reopen", head, "--repo", repo])
        run(
            [
                "gh",
                "pr",
                "edit",
                head,
                "--repo",
                repo,
                "--base",
                base,
                "--title",
                title,
                "--body",
                body,
            ],
            check=True,
        )


if __name__ == "__main__":
    try:
        main()
    except CalledProcessError as err:
        exit(err.stdout + err.stderr)
