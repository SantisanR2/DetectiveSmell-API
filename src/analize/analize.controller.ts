import { Body, Controller, Post } from '@nestjs/common';
import * as path from 'path';
import * as fs from 'fs';
import { exec } from 'child_process';
import { Report } from './report.entity';
import { analyzeSpringBootProject } from './spring';

@Controller('analize')
export class AnalizeController {

    constructor() {
        
    }

    @Post()
    async clonePrivateRepo(@Body() body: { url: string; token: string; type: string }): Promise<Report> {
        const { url, token, type } = body;
        const repoPath = path.join(__dirname, 'tempRepo');
        const nameRepo = url.split('/')[url.split('/').length - 1];
        const user = url.split('/')[url.split('/').length - 2];
        const cloneCommand = `git clone https://${token}@github.com/${user}/${nameRepo} ${repoPath}`;

        const springRulesPath = path.join(__dirname, '../../src/rules/spring.json');
        const rulesSpringBootContent = fs.readFileSync(springRulesPath, 'utf8');
	    const rulesSpringBoot = JSON.parse(rulesSpringBootContent);

        // Clonar el repositorio
        return new Promise((resolve, reject) => {
            exec(cloneCommand, async (error) => {
                if (error) {
                    reject({line: 'Error at cloning the repo: ' + error});
                }

                //TODO: Analizar el código del repositorio clonado
                if (type === 'spring') {
                    const report = analyzeSpringBootProject(repoPath, rulesSpringBoot);
                    resolve(report);               
                } else if (type === 'nest') {
                        
                } else if (type === 'angular') {

                }

                // Eliminar el repositorio clonado
                exec(`rm -rf ${repoPath}`, (rmError) => {
                    if (rmError) {
                    reject({line: 'Error at removing the repo: ' + rmError});
                    }
                });

                //Eliminar el path tempRepo
                fs.rmdir(repoPath, { recursive: true }, (error) => {
                    if (error) {
                    console.error('Error al eliminar el directorio:', error);
                    }
                });
            });
        });        
    }

    @Post()
    async clonePublicRepo(@Body() body: { url: string; type: string }): Promise<Report> {
        const { url, type } = body;
        const repoPath = path.join(__dirname, 'tempRepo');
        const cloneCommand = `git clone ${url} ${repoPath}`;

        const springRulesPath = path.join(__dirname, '../../src/rules/spring.json');
        const rulesSpringBootContent = fs.readFileSync(springRulesPath, 'utf8');
	    const rulesSpringBoot = JSON.parse(rulesSpringBootContent);

        // Clonar el repositorio
        return new Promise((resolve, reject) => {
            exec(cloneCommand, async (error) => {
                if (error) {
                    reject({line: 'Error at cloning the repo: ' + error});
                }

                if (type === 'spring') {
                    const report = analyzeSpringBootProject(repoPath, rulesSpringBoot);
                    resolve(report);               
                } else if (type === 'nest') {
                    //TODO: Analisis de NestJS
                } else if (type === 'angular') {
                    //TODO: Analisis de Angular
                }

                // Eliminar el repositorio clonado
                exec(`rm -rf ${repoPath}`, (rmError) => {
                    if (rmError) {
                    reject({line: 'Error at removing the repo: ' + rmError});
                    }
                });

                //Eliminar el path tempRepo
                fs.rmdir(repoPath, { recursive: true }, (error) => {
                    if (error) {
                    console.error('Error al eliminar el directorio:', error);
                    }
                });
            });
        });
    }
}
