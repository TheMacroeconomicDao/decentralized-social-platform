import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service.js';
import * as fs from 'fs';
import * as path from 'path';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  /**
   * Returns build and environment info for the API root endpoint.
   * @returns {object} Build info: name, version, buildTime, gitHash, env
   */
  @Get()
  getBuildInfo() {
    let buildInfo: any = {};
    try {
      const infoPath = path.resolve(__dirname, '../build-info.json');
      if (fs.existsSync(infoPath)) {
        buildInfo = JSON.parse(fs.readFileSync(infoPath, 'utf-8'));
      }
    } catch (e) {
      // ignore
    }
    const env = (process.env.NODE_ENV || 'development').toLowerCase();
    const isProd = env === 'production';
    return {
      name:
        buildInfo.name || process.env.npm_package_name || 'gprod-new-backend',
      version: isProd
        ? undefined
        : buildInfo.version || process.env.npm_package_version || 'unknown',
      buildTime: buildInfo.buildTime || process.env.BUILD_TIME || 'unknown',
      gitHash: isProd
        ? undefined
        : buildInfo.gitHash || process.env.GIT_HASH || 'unknown',
      env: process.env.NODE_ENV || 'development',
    };
  }
}
