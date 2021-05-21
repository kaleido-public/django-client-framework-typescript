#!/usr/bin/env python3

import click
from subprocess import CalledProcessError, run


@click.command()
@click.option("--head", required=True)
@click.option("--title", required=True)
@click.option("--base", required=True)
@click.option("--body", required=True)
def main(head, base, title, body):
    print("Input your github token:")
    print("> ", end="", flush=True)
    run(["gh", "auth", "login", "--with-token"], check=True)
    create_pr = run(
        [
            "gh",
            "pr",
            "create",
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
        run(["gh", "pr", "reopen", head])
        run(
            [
                "gh",
                "pr",
                "edit",
                head,
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
