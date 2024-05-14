import * as fs from "fs";
import * as path from "path";

export function analyzeAngular(projectDirectory: string, rules: any, url: string, branch: string): any {
    
    const url_base = 'https://prueba.com/';
    branch = branch.replace('\n', '');

    const folderStructure: { [folderName: string]: string[] } = {};

    function readProject(directory: string, parentFolder: string = ""): void {
        fs.readdirSync(directory).forEach(file => {
            const filePath = path.join(directory, file);
            const stats = fs.statSync(filePath);

            if (stats.isDirectory()) {
                readProject(filePath, path.join(parentFolder, file));
            } else if (file.endsWith(".ts")) {
                const folder = parentFolder || "/";
                if (!folderStructure[folder]) {
                    folderStructure[folder] = [];
                }
                folderStructure[folder].push(filePath);
            }
        });
    }

    readProject(projectDirectory);

    interface GlobalReport {
        [key: string]: {
            id: number;
            name: string;
            description: string;
            example: string;
            message: string;
            severity: string;
            line: number;
            path: string;
            absolutePath: string;
        }[];
    }

    const globalReport: GlobalReport = {
        'Capa de infraestructura': [],
        'Capa de módulos': []
    }; 
    for (const rule of rules.rules) {
            if(rule.category==="Capa de módulos"){
                if(rule.name==="Los nombres de los módulos deben estar en singular"){
                    // eslint-disable-next-line @typescript-eslint/no-var-requires
                    const natural = require('natural');
                    const nounInflector = new natural.NounInflector();
                    for (const folderName in folderStructure) {
                        if (folderName.toLowerCase().includes('app')){
                            const files = folderStructure[folderName];
                            if (files.some(file => file.endsWith('.module.ts'))) {
                                const moduleName = path.basename(folderName, path.extname(folderName));
                                const modulePath = path.join(projectDirectory, folderName, moduleName + '.module.ts');
                                const singularizeModuleName = nounInflector.singularize(moduleName);
                                const relativePath = path.relative(path.join(projectDirectory, 'src'), modulePath);
                                const finalRelativePath = path.join('src', relativePath);
                                if (moduleName !== singularizeModuleName) {
                                    const urlFile = `[${modulePath.split('\\').at(-1)}](${url.substring(0,url.length-4)}/blob/${branch}/${finalRelativePath.replace(/\\/g, '/')})`;
                                    const message = "Encontrado en el archivo: " + urlFile + "\n\nPara mayor información acerca del error, revisar la documentación: [Documentacion](" + url_base + "rules/angular/" + rules.rules[0].id + ")";
                                    globalReport['Capa de módulos'].push({
                                        message: message,
                                        severity: rule.severity,
                                        name: rule.name,
                                        id: rule.id,
                                        description: rule.description,
                                        example: rule.example,
                                        line: 1,
                                        path: modulePath.replace(/\\/g, '\\\\'),
                                        absolutePath: moduleName.split('\\').at(-1) || ""
                                    });
                                }
                            }
                        }
                    }
                }
            }
            if(rule.category==="Capa de infraestructura"){
                const foldersToExcludeKeywords = ['cypress', 'Prueba_Cypress', 'reports', 'interceptors', 'environments', 'test', 'prueba', 'pruebas']; // Palabras clave para identificar carpetas de prueba
                for (const folderName in folderStructure) {
                    let excludeFolder = false;
                    for (const keyword of foldersToExcludeKeywords) {
                        if (folderName.toLowerCase().includes(keyword)) {
                            excludeFolder = true;
                            break;
                        }
                    }
                    if (excludeFolder) {
                        continue;
                    }                
                    if(rule.name==="No debería haber servicios ni componentes a nivel de la carpeta 'app' que no sean los propios de 'app'"){
                        const files = folderStructure[folderName];
                        const folderBaseName = path.basename(folderName);
                        for (const filename of files) {
                            const fileBaseName = path.basename(filename, path.extname(filename));
                            const modulePath = path.join(folderName, filename);
                            if (!fileBaseName.includes(folderBaseName)) {
                                if (folderBaseName.toLowerCase() === 'app') {
                                    const srcIndex = modulePath.indexOf('src');
                                    const relativePath = modulePath.substring(srcIndex)
                                    const urlFile = `[${filename.split('\\').at(-1)}](${url.substring(0,url.length-4)}/blob/${branch}/${relativePath.replace(/\\/g, '/')})`;
                                    const message = "Encontrado en el archivo: " + urlFile + "\n\nPara mayor información acerca del error, revisar la documentación: [Documentacion](" + url_base + "rules/angular/" + rules.rules[0].id + ")";
                                    globalReport['Capa de infraestructura'].push({
                                        message: message,
                                        severity: rule.severity,
                                        name: rule.name,
                                        id: rule.id,
                                        description: rule.description,
                                        example: rule.example,
                                        line: 1,
                                        path: filename.replace(/\\/g, '\\\\'),
                                        absolutePath: modulePath.split('\\').at(-1) || ""
                                    });
                                }
                            }
                        }
                    }
                    if(rule.name==="Los nombres de las carpetas (módulos) deben coincidir con sus archivos"){
                        const files = folderStructure[folderName];
                        const folderBaseName = path.basename(folderName);
                        for (const filename of files) {
                            const fileBaseName = path.basename(filename, path.extname(filename));
                            const modulePath = path.join(fileBaseName, filename);
                            if (!fileBaseName.includes(folderBaseName)) {
                                const srcIndex = modulePath.indexOf('src');
                                const relativePath = modulePath.substring(srcIndex)
                                const urlFile = `[${filename.split('\\').at(-1)}](${url.substring(0,url.length-4)}/blob/${branch}/${relativePath.replace(/\\/g, '/')})`;
                                const message = "Encontrado en el archivo: " + urlFile + "\n\nPara mayor información acerca del error, revisar la documentación: [Documentacion](" + url_base + "rules/angular/" + rules.rules[0].id + ")";
                                globalReport['Capa de infraestructura'].push({
                                    message: message,
                                    severity: rule.severity,
                                    name: rule.name,
                                    id: rule.id,
                                    description: rule.description,
                                    example: rule.example,
                                    line: 1,
                                    path: filename.replace(/\\/g, '\\\\'),
                                    absolutePath: modulePath.split('\\').at(-1) || ""
                                }); 
                            }
                        }
                    }
                }
            }
        }
        return globalReport;
    }