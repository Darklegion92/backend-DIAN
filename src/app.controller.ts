import { Controller, Get, Res } from '@nestjs/common';
import { Response } from 'express';

@Controller()
export class AppController {
  @Get()
  root(@Res() res: Response) {
    res.type('html').send(`
      <div style="display:flex;flex-direction:column;align-items:center;justify-content:center;height:100vh;background:#fff;">
        <img src="/logo.gif" alt="SolTec" style="max-width:300px;" />
        <h1 style="color:#f9b233;font-family:sans-serif;margin-top:24px;">API DIAN</h1>
      </div>
    `);
  }
}
