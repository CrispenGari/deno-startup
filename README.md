### Deno

In this repository we are going to learn how we can use the `deno` runtime environment to create applications with `typescript` using deno.

<p align="center">
    <img src="deno.webp" alt="deno" width="300"/>
</p>

### Installation

To install `deno` follow the installation guide from their oficial documentation found [here](https://deno.land/manual@v1.32.3/getting_started/installation).

To install `deno` on windows open the `Powershell` as an administrator and run the following command:

```shell
choco install deno
```

### Checking in Deno is installed.

To check if deno is installed run the following command:

```shell
deno -V
```

> Howdy!! if you get the deno version you have successifully install deno in your computer.

### Setting Deno Environment.

I will be using `VSCode`to create my deno application so i need to install the `deno` [extension](https://marketplace.visualstudio.com/items?itemName=denoland.vscode-deno) in vscode. And after installing this extension i will open my `settings.json` in vscode and add the following property:

```json
{
  "deno.enabled": true
}
```

After that you can save the `settings.json` and your environment is already `set`.
