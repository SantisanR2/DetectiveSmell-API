import { Project } from 'ts-morph';
import * as path from 'path';



export function analyzeNestJsProject(proyect:string, rulesTotal:any,url: string, branch: string): any{

    const url_base = 'https://prueba.com/';
    branch = branch.replace('\n', '');
    const projectPath =  proyect;
    
    const project = new Project({
        tsConfigFilePath: projectPath+"\\tsconfig.json",
    });
    const entryFile = project.getCompilerOptions().baseUrl;
    const projectName = entryFile?.split("/").pop();
    interface Rule {
        id: number;
        name: string;
        description: string;
        example: string;
        message: string;
        severity: string;
        line: number;
        pathName: string;
        absolutePath:string
      }
    interface Rules {
        [key: string]: Rule[];
    }
    const globalReport:Rules = {
            'Persistence Layer':[],
            'Logic Layer': [],
            'Controller Layer': [],
            'DTO Layer': []
            };




    const objectTypes = new Set(["String","Integer","FLoat","Date","Boolean"]);
    for(const rule of rulesTotal.rules){
        if(rule.category==="Capa de persistencia"|| rule.category==="Persistence Layer"){
            project.getSourceFiles().forEach(file=>{
                const classes = file.getClasses(); 
                classes.forEach(classFile=>{
                    if(classFile.getName()?.includes("Entity")){
                        if(Number(rule.id)===1){
                        const properties = classFile.getProperties();
                        properties.forEach(property=>{
                            const type = property.getType();
                            const filePath = classFile.getSourceFile().getFilePath();
                            const shortenedPath= path.relative(projectPath, filePath);
                            const absolutePath=projectName+"/" + shortenedPath.replace("\\","/");
                            if(!objectTypes.has(type.getText())){
                                const line = property.getStartLineNumber();
                                    const titulo=`The attribute ${property} is a primitive attribute in the class <span><b>${absolutePath}</b></span>`;
                                    const urlFile = `[${filePath.split('\\').at(-1)}](${url.substring(0,url.length-4)}/blob/${branch}/${filePath.replace(/\\/g, '/').substring(1)})`;
                                    const message = "Found in the file: " + urlFile + "\n\nFound in the line: " + line + "\n\nFor more information about the error, please review the documentation: [Documentation](" + url_base + "rules/spring/" + rule.id +")";
                                    globalReport['Persistence Layer'].push({
                                        id: rule.id,
                                        name: titulo,
                                        description: rule.description,
                                        message: message,
                                        severity: rule.severity,
                                        line: line,
                                        example: rule.example,
                                        pathName: filePath,
                                        absolutePath:absolutePath
                                    });  
                            }
    
                        });
                    }
                        else if(Number(rule.id)===2){
                            if(!classFile.getDecorator("Data")){
                                const line= classFile.getStartLineNumber();
                                const filePath = classFile.getSourceFile().getFilePath();
                                const shortenedPath= path.relative(projectPath, filePath);
                                const absolutePath=projectName+"/" + shortenedPath.replace("\\","/");
                                        const titulo=`The @Data decorator is missing in the class <span><b>${absolutePath}</b></span>`;
                                        const urlFile = `[${filePath.split('\\').at(-1)}](${url.substring(0,url.length-4)}/blob/${branch}/${filePath.replace(/\\/g, '/').substring(1)})`;
                                        const message = "Found in the file: " + urlFile + "\n\nFound in the line: " + line + "\n\nFor more information about the error, please review the documentation: [Documentation](" + url_base + "rules/spring/" + rule.id +")";
                                        globalReport['Persistence Layer'].push({
                                            id: rule.id,
                                            name: titulo,
                                            description: rule.description,
                                            message: message,
                                            severity: rule.severity,
                                            line: line,
                                            example: rule.example,
                                            pathName: filePath,
                                            absolutePath:absolutePath
                                        });  
                            }
                        }
                    }
                });
            });
        }
    else if(rule.category==="Capa de lógica"|| rule.category==="Logic Layer"){
        project.getSourceFiles().forEach(file=>{
            const classes = file.getClasses(); 
            classes.forEach(classFile=>{
                if(classFile.getName()?.includes("Service")){
                    if(Number(rule.id)===3){
                        if(!classFile.getDecorator("Service")){
                            const line= classFile.getStartLineNumber();
                            const filePath = classFile.getSourceFile().getFilePath();
                            const shortenedPath= path.relative(projectPath, filePath);
                            const absolutePath=projectName+"/" + shortenedPath.replace("\\","/");
                                    const titulo=`The @Service decorator is missing in the class <span><b>${absolutePath}</b></span>`;
                                    const urlFile = `[${filePath.split('\\').at(-1)}](${url.substring(0,url.length-4)}/blob/${branch}/${filePath.replace(/\\/g, '/').substring(1)})`;
                                    const message = "Found in the file: " + urlFile + "\n\nFound in the line: " + line + "\n\nFor more information about the error, please review the documentation: [Documentation](" + url_base + "rules/spring/" + rule.id +")";
                                    globalReport['Logic Layer'].push({
                                        id: rule.id,
                                        name: titulo,
                                        description: rule.description,
                                        message: message,
                                        severity: rule.severity,
                                        line: line,
                                        example: rule.example,
                                        pathName: filePath,
                                        absolutePath:absolutePath
                                    });  
                        }

                    }
                    else if(Number(rule.id)===4){

                    }

                }
            });
        });
    }
    else if(rule.category==="Capa de controladores" || rule.category==="Controller Layer"){
        project.getSourceFiles().forEach(file=>{
            const classes = file.getClasses(); 
            classes.forEach(classFile=>{
                if(classFile.getName()?.includes("Controller")){
                    if(Number(rule.id)===5){
                    if(!classFile.getDecorator("Controller")){
                        const line= classFile.getStartLineNumber();
                        const filePath = classFile.getSourceFile().getFilePath();
                        const shortenedPath= path.relative(projectPath, filePath);
                        const absolutePath=projectName+"/" + shortenedPath.replace("\\","/");
                                const titulo=`The @Controller decorator is missing in the class <span><b>${absolutePath}</b></span>`;
                                const urlFile = `[${filePath.split('\\').at(-1)}](${url.substring(0,url.length-4)}/blob/${branch}/${filePath.replace(/\\/g, '/').substring(1)})`;
                                const message = "Found in the file: " + urlFile + "\n\nFound in the line: " + line + "\n\nFor more information about the error, please review the documentation: [Documentation](" + url_base + "rules/spring/" + rule.id +")";
                                globalReport['Controller Layer'].push({
                                    id: rule.id,
                                    name: titulo,
                                    description: rule.description,
                                    message: message,
                                    severity: rule.severity,
                                    line: line,
                                    example: rule.example,
                                    pathName: filePath,
                                    absolutePath:absolutePath
                                });  
                    }}
                    else if(Number(rule.id)===6){
                        if(!classFile.getDecorator("RequestMapping")){
                            const line= classFile.getStartLineNumber();
                            const filePath = classFile.getSourceFile().getFilePath();
                            const shortenedPath= path.relative(projectPath, filePath);
                            const absolutePath=projectName+"/" + shortenedPath.replace("\\","/");
                                    const titulo=`The @RequestMapping decorator is missing in the class <span><b>${absolutePath}</b></span>`;
                                    const urlFile = `[${filePath.split('\\').at(-1)}](${url.substring(0,url.length-4)}/blob/${branch}/${filePath.replace(/\\/g, '/').substring(1)})`;
                                    const message = "Found in the file: " + urlFile + "\n\nFound in the line: " + line + "\n\nFor more information about the error, please review the documentation: [Documentation](" + url_base + "rules/spring/" + rule.id +")";
                                    globalReport['Controller Layer'].push({
                                        id: rule.id,
                                        name: titulo,
                                        description: rule.description,
                                        message: message,
                                        severity: rule.severity,
                                        line: line,
                                        example: rule.example,
                                        pathName: filePath,
                                        absolutePath:absolutePath
                                    });  
                        }
                    }
                    else if(Number(rule.id)===7){
                        const properties = classFile.getProperties();
                        properties.forEach(property=>{
                            if(!property.getDecorator("Autowired")){
                                const line= property.getStartLineNumber();
                                const filePath = classFile.getSourceFile().getFilePath();
                                const shortenedPath= path.relative(projectPath, filePath);
                                const absolutePath=projectName+"/" + shortenedPath.replace("\\","/");
                                        const titulo=`The @Autowired decorator is missing on the ${property} attribute of the class <span><b>${absolutePath}</b></span>`;
                                        const urlFile = `[${filePath.split('\\').at(-1)}](${url.substring(0,url.length-4)}/blob/${branch}/${filePath.replace(/\\/g, '/').substring(1)})`;
                                        const message = "Found in the file: " + urlFile + "\n\nFound in the line: " + line + "\n\nFor more information about the error, please review the documentation: [Documentation](" + url_base + "rules/spring/" + rule.id +")";
                                        globalReport['Controller Layer'].push({
                                            id: rule.id,
                                            name: titulo,
                                            description: rule.description,
                                            message: message,
                                            severity: rule.severity,
                                            line: line,
                                            example: rule.example,
                                            pathName: filePath,
                                            absolutePath:absolutePath
                                        });  
                            }
                        });
                    }
                    else if(Number(rule.id)===8){
                        const methods = classFile.getMethods();
                        methods.forEach(m=>{
                            if(m.getDecorator("Get")){
                                const returnType=m.getReturnType();
                                if(!returnType||returnType.getText()!=="DetailDTO"){
                                    const line= m.getStartLineNumber();
                                    const filePath = classFile.getSourceFile().getFilePath();
                                    const shortenedPath= path.relative(projectPath, filePath);
                                    const absolutePath=projectName+"/" + shortenedPath.replace("\\","/");
                                            const titulo=`There is no DetailDTO return in the method <b>${m.getName()}</b> of the class <span><b>${absolutePath}</b></span>`;
                                            const urlFile = `[${filePath.split('\\').at(-1)}](${url.substring(0,url.length-4)}/blob/${branch}/${filePath.replace(/\\/g, '/').substring(1)})`;
                                            const message = "Found in the file: " + urlFile + "\n\nFound in the line: " + line + "\n\nFor more information about the error, please review the documentation: [Documentation](" + url_base + "rules/spring/" + rule.id +")";
                                            globalReport['Controller Layer'].push({
                                                id: rule.id,
                                                name: titulo,
                                                description: rule.description,
                                                message: message,
                                                severity: rule.severity,
                                                line: line,
                                                example: rule.example,
                                                pathName: filePath,
                                                absolutePath:absolutePath
                                            });  
                                }
                            }
                        });
                    }
                }
            });
        });
    }
    else if(rule.category==="Capa de DTO" || rule.category==="DTO Layer")
    {
        project.getSourceFiles().forEach(file=>{
            const classes = file.getClasses(); 
            classes.forEach(classFile=>{
                if(classFile.getName()?.includes("DTO")||classFile.getName()?.includes("DetailDTO")){
                    if(Number(rule.id)===9){
                        if(!classFile.getDecorator("Data")){
                            const line= classFile.getStartLineNumber();
                            const filePath = classFile.getSourceFile().getFilePath();
                            const shortenedPath= path.relative(projectPath, filePath);
                            const absolutePath=projectName+"/" + shortenedPath.replace("\\","/");
                                    const titulo=`The @Data decorator is missing in the class <span><b>${absolutePath}</b></span>`;
                                    const urlFile = `[${filePath.split('\\').at(-1)}](${url.substring(0,url.length-4)}/blob/${branch}/${filePath.replace(/\\/g, '/').substring(1)})`;
                                    const message = "Found in the file: " + urlFile + "\n\nFound in the line: " + line + "\n\nFor more information about the error, please review the documentation: [Documentation](" + url_base + "rules/spring/" + rule.id +")";
                                    globalReport['DTO Layer'].push({
                                        id: rule.id,
                                        name: titulo,
                                        description: rule.description,
                                        message: message,
                                        severity: rule.severity,
                                        line: line,
                                        example: rule.example,
                                        pathName: filePath,
                                        absolutePath:absolutePath
                                    });  
                        }
                    }
                    else if(Number(rule.id)===10){
                    }

                }
            });
        });

    }

    }
    return globalReport
 /*
    const panel = vscode.window.createWebviewPanel(
        'analysisReport', // Identificador del panel
        'Informe de Análisis del Proyecto', // Título del panel
        vscode.ViewColumn.One, // Muestra el panel en la columna activa
        {
            enableScripts: true,
            enableCommandUris: true,
        } // Opciones de webview
    );
    panel.webview.html = `
    <!DOCTYPE html>
    <html lang="es">
    <head>
    <!DOCTYPE html>
    <html lang="es">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <meta http-equiv="Content-Security-Policy" content="default-src 'none'; style-src 'unsafe-inline'; script-src 'unsafe-inline';">
        <title>Informe de Análisis del Proyecto</title>
        <style>
            body {
                font-family: Arial, sans-serif;
                margin: 20px;
                background-color: #f4f4f4;
                color: #000000;
            }
            h1 {
                color: #333;
            }
            .card {
                background-color: #fff;
                border-radius: 5px;
                box-shadow: 0 2px 5px rgba(0, 0, 0, 0.3);
                margin: 20px 0;
                padding: 20px;
            }
            .card h3 {
                margin-top: 0;
            }
            .card p {
                margin: 10px 0;
            }
            .btn-detail {
                background-color: #008CBA; /* Blue *//*
                border: none;
                color: white;
                padding: 10px 20px;
                text-align: center;
                text-decoration: none;
                display: inline-block;
                font-size: 16px;
                margin: 10px 2px;
                cursor: pointer;
            }
            .severity-leve {
                color: green;
            }
            .severity-moderado {
                color: orange;
            }
            .severity-grave {
                color: red;
            }
            .rule-detail {
                max-height: 0;
                overflow: hidden;
                transition: max-height 0.2s ease-out;
                background: #f1f1f1;
            }
            .rule h3 {
                cursor: pointer;
                font-size: 16px;
                color: #333;
                font-weight: 300;
            }
            .rule-detail p {
                padding: 0 18px;
            }
            .rule:hover {
                background: #ddd;
            }
            .show {
                max-height: 500px;
            }
        </style>
    </head>
    <body>
        <h1>Informe de Análisis del Proyecto</h1>
        <p>Proyecto analizado: ${projectName}</p>
        <hr>
        <h2 id="lines-of-code-counter">Reglas Violadas:</h2>
        ${Object.keys(globalReport).map(capa=>`
        <div class="card">
            <h3>${capa}</h3>
            ${globalReport[capa].map(rule=>`
            <div class="rule">
                <div class="flexbox" onclick="this.nextElementSibling.classList.toggle('show')">
                    <div class="flex">
                        <h3>${rule.name} en el archivo <span><b>${rule.pathName.split('\\').at(-1)}</b></span></h3>
                    </div>
                    <button class="btn" onclick="abrirArchivo('${proyect.replace(/\\/g, '\\\\')}${rule.pathName.replace(/\\/g, '\\\\')}',${rule.line})">
                        <span>Abrir 
                        <svg width="14px" height="14px" viewBox="0 0 15 14" xmlns="http://www.w3.org/2000/svg" fill="currentColor"><path fill-rule="evenodd" clip-rule="evenodd" d="M13.71 4.29l-3-3L10 1H4L3 2v12l1 1h9l1-1V5l-.29-.71zM13 14H4V2h5v4h4v8zm-3-9V2l3 3h-3z"/></svg>
                        </span>
                    </button>
                </div>
                <div class="rule-detail">
                    <p><b>Nombre de la regla:</b> ${rule.name}</p>
                    <p><b>Descripción:</b> ${rule.description}</p>
                    <p><b>Ejemplo:</b><br><div class="cardExample">${rule.example}</div></p>
                    <p><b>Detalle:</b> ${rule.message}</p>
                    <p class="severity-${rule.severity.toLowerCase()}"><b>Severidad:</b> ${rule.severity}</p>
                </div>
                <hr>
            </div>
        `).join('')}
    </div>
`).join('')}
</body>
</html>`;
*/
}


