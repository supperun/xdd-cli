#!/usr/bin/env node

import inquirer from "inquirer";
import downloadGit from "download-git-repo";
import fs from "fs";
import path from "path";
import chalk from "chalk";
import ora from "ora";
import { Command } from "commander";

let __dirname = import.meta.dirname;

const config = {
  vue: {
    downloadpath: "github:vuejs/vue",
    sourceName: "vue-source",
  },
  react: {
    downloadpath: "github:facebook/react",
    sourceName: "react-source",
  },
  angular: {
    downloadpath: "githup:angular/angular",
    sourceName: "angular-source",
  },
  ts: "ts.config.json",
  webpack: "webpack.config.js",
};

let programe = new Command();
programe.version("1.0.0");
programe
  .command("config [config-type]")
  .description("获取指定类型配置文件: webpack 、ts")
  .action((arg) => {
    if (["ts.config.json", "webpack.config.js"].includes(config[arg])) {
      let spinner = ora(chalk.greenBright("下载中，请稍后...")).start();
      fs.createReadStream(`${__dirname}/lib/${config[arg]}`, {
        highWaterMark: 5,
      }).pipe(
        fs.createWriteStream(path.resolve(process.cwd(), `./${config[arg]}`))
      );
      console.log(chalk.green(`${config[arg]}下载完成^_^`));
      spinner.stop();
    } else {
      inquirer
        .prompt([
          {
            type: "list",
            message: "请选择需要下载的配置文件:",
            name: "config",
            choices: ["ts.config.json", "webpack.config.js"],
          },
          {
            type: "confirm",
            message: "是否下载？",
            name: "yesOrno",
          },
        ])
        .then((answers) => {
          if (answers.yesOrno) {
            let spinner = ora(chalk.greenBright("下载中，请稍后...")).start();
            fs.createReadStream(`${__dirname}/lib/${answers.config}`, {
              highWaterMark: 5,
            }).pipe(
              fs.createWriteStream(
                path.resolve(process.cwd(), `./${answers.config}`)
              )
            );
            console.log(chalk.green(`${answers.config}下载完成^_^`));
            spinner.stop();
          } else {
            console.log(chalk.green("拜拜啦..."));
          }
        });
    }
  });
programe
  .command("source [source-type]")
  .description("下载指定前端框架最新源码: vue、react、angular")
  .action((source) => {
    if (["vue", "react", "angular"].includes(source)) {
      downloadFrontEnd({ frontEndFramework: source });
    } else {
      inquirer
        .prompt([
          {
            type: "input",
            message: "请输入文件夹名：",
            name: "dirName",
          },
          {
            type: "list",
            message: "请选择需要下载的前端框架？",
            name: "frontEndFramework",
            choices: ["vue", "react", "angular"],
          },
          {
            type: "confirm",
            message: "是否下载？",
            name: "yesOrno",
          },
        ])
        .then((answers) => {
          if (answers.yesOrno) {
            downloadFrontEnd(answers);
          } else {
            console.log(chalk.green("拜拜啦..."));
          }
        })
        .catch((error) => {
          console.log(chalk.redBright("退出了噢..."));
        });
    }
  });
programe.parse(process.argv);

function downloadFrontEnd(answers) {
  let sourceName =
    answers.dirName || config[answers.frontEndFramework].sourceName;
  if (fs.existsSync(`./${sourceName}`)) {
    fs.rmSync(`./${sourceName}`, { recursive: true });
  }
  let cwd = process.cwd();
  let spinner = ora(chalk.greenBright("下载中，请稍后...")).start();
  downloadGit(
    config[answers.frontEndFramework].downloadpath,
    path.resolve(cwd, sourceName),
    {},
    (error) => {
      if (error) {
        console.log(chalk.red("下载失败o_0"));
      } else {
        console.log(chalk.green(`${answers.frontEndFramework}下载完成^_^`));
      }
      spinner.stop();
    }
  );
}
