const apiRedirect = process.argv[2];
if (apiRedirect) {
    const redirects = [
        `/api/*   ${apiRedirect}/:splat 200`,
        `/*       /index.html           200`
    ];
    const fs = require("fs");
    fs.writeFile(
        "dist/client-app/_redirects",
        redirects.join("\n"),
        () => null
    );
}
