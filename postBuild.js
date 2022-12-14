const apiRedirect = process.argv[2];
if (apiRedirect) {
    const fs = require("fs");
    fs.writeFile(
        "dist/client-app/_redirects",
        `/api/* ${apiRedirect}/:splat`,
        () => null
    );
}
