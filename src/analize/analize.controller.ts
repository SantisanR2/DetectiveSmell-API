import { Body, Controller, Post } from '@nestjs/common';
import * as path from 'path';
import * as fs from 'fs';
import { exec } from 'child_process';
import { Report } from './report.entity';
import { analyzeSpringBootProject } from './spring';
import axios from 'axios';
import { analyzeNestJsProject } from './nestjs';

@Controller('analize')
export class AnalizeController {

    constructor() {
        
    }

    @Post()
    async clonePrivateRepo(@Body() body: { url: string; token: string; type: string }): Promise<Report> {
        const { url, token, type } = body;
        const repoPath = path.join(__dirname, 'tempRepo');
        let urlRepo = url;
        if (url.startsWith('git')) {
            const urlArray = url.split(':');
            urlArray[0] = 'https://github.com';
            urlArray[1] = urlArray[1].slice(0, -4);
            urlRepo = urlArray.join('/');
        }
        let branch = '';
        let nameRepo = urlRepo.split('/')[urlRepo.split('/').length - 1];
        nameRepo = nameRepo.slice(0, -4);
        const user = urlRepo.split('/')[urlRepo.split('/').length - 2];
        const cloneCommand = `git clone https://${token}@github.com/${user}/${nameRepo}.git ${repoPath}`;

        exec(`git branch --show-current`, (error, stdout) => {
            if (error) {
                console.error('Error al obtener la rama actual:', error);
            }
            branch = stdout;
        });
        branch = branch.replace('\n', '');
        const springRulesPath = path.join(__dirname, '../../src/rules/spring.json');
        const rulesSpringBootContent = fs.readFileSync(springRulesPath, 'utf8');
	    const rulesSpringBoot = JSON.parse(rulesSpringBootContent);

        const nestRulesPath = path.join(__dirname, '../../src/rules/enPruebas.json');
        const rulesNestContent = fs.readFileSync(nestRulesPath, 'utf8');
	    const rulesNest = JSON.parse(rulesNestContent);

        // Configuración para las solicitudes de la API de GitHub
        const config = {
        headers: {
            'Authorization': `token ${token}`,
            'Accept': 'application/vnd.github.v3+json'
        }
        };
    
        // Función para crear un issue
        async function createIssue(owner: string, repo: string, issue: { title: string, body: string }) {
            console.log(issue);
            const url = `https://api.github.com/repos/${owner}/${repo}/issues`;
            const response = await axios.post(url, issue, config);
            return response.data;
        }

        // Clonar el repositorio
        return new Promise((resolve, reject) => {
            exec(cloneCommand, async (error) => {
                if (error) {
                    reject({line: 'Error at cloning the repo: ' + error});
                }
                if (type === 'spring') {
                    const report = analyzeSpringBootProject(repoPath, rulesSpringBoot, urlRepo, branch);
                    for (const rule of report['Capa de persistencia']) {
                        const issue = {
                            title: "Issue: " + rule.name,
                            body: rule.message,
                            labels: ['smell', rule.severity, 'SmellSpringID' + rule.id]
                        };
                        createIssue(user, nameRepo, issue)
                        .then(data => console.log(`Issue creado: ${data.url}`))
                        .catch(error => console.error(`Error al crear el issue: ${error}`));
                    }
                    for (const rule of report['Capa de lógica']) {
                        const issue = {
                            title: "Issue: " + rule.name,
                            body: rule.message,
                            labels: ['smell', rule.severity, 'SmellSpringID' + rule.id]
                        };
                        createIssue(user, nameRepo, issue)
                        .then(data => console.log(`Issue creado: ${data.url}`))
                        .catch(error => console.error(`Error al crear el issue: ${error}`));
                    }
                    for (const rule of report['Capa de controladores']) {
                        const issue = {
                            title: "Issue: " + rule.name,
                            body: rule.message,
                            labels: ['smell', rule.severity, 'SmellSpringID' + rule.id]
                        };
                        createIssue(user, nameRepo, issue)
                        .then(data => console.log(`Issue creado: ${data.url}`))
                        .catch(error => console.error(`Error al crear el issue: ${error}`));
                    }
                    resolve(report);               
                } else if (type === 'nest') {
                    //TODO: Implementar la lógica para analizar un proyecto de NestJS
                    const report = analyzeNestJsProject(repoPath,rulesNest, urlRepo, branch)
                    for (const rule of report['Persistence Layer']) {
                        const issue = {
                            title: "Issue: " + rule.name,
                            body: rule.message,
                            labels: ['smell', rule.severity, 'SmellSpringID' + rule.id]
                        };
                        createIssue(user, nameRepo, issue)
                        .then(data => console.log(`Issue creado: ${data.url}`))
                        .catch(error => console.error(`Error al crear el issue: ${error}`));
                    }
                    for (const rule of report['Logic Layer']) {
                        const issue = {
                            title: "Issue: " + rule.name,
                            body: rule.message,
                            labels: ['smell', rule.severity, 'SmellSpringID' + rule.id]
                        };
                        createIssue(user, nameRepo, issue)
                        .then(data => console.log(`Issue creado: ${data.url}`))
                        .catch(error => console.error(`Error al crear el issue: ${error}`));
                    }
                    for (const rule of report['Controller Layer']) {
                        const issue = {
                            title: "Issue: " + rule.name,
                            body: rule.message,
                            labels: ['smell', rule.severity, 'SmellSpringID' + rule.id]
                        };
                        createIssue(user, nameRepo, issue)
                        .then(data => console.log(`Issue creado: ${data.url}`))
                        .catch(error => console.error(`Error al crear el issue: ${error}`));
                    }
                    for (const rule of report['DTO Layer']) {
                        const issue = {
                            title: "Issue: " + rule.name,
                            body: rule.message,
                            labels: ['smell', rule.severity, 'SmellSpringID' + rule.id]
                        };
                        createIssue(user, nameRepo, issue)
                        .then(data => console.log(`Issue creado: ${data.url}`))
                        .catch(error => console.error(`Error al crear el issue: ${error}`));
                    }
                    resolve(report);
                    
                } else if (type === 'angular') {
                    //TODO: Implementar la lógica para analizar un proyecto de Angular
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
