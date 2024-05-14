import db from './mongo';
import CommitInfo from './commitInfo';

async function guardarInfoCommit(repository: string, commitDate: Date, commitHash: string, committer: string) {
  try {
    await db;
    const infoCommit = new CommitInfo({
      repository,
      commitDate,
      commitHash,
      committer,
    });
    await infoCommit.save();
    console.log('Información de commit guardada exitosamente');
  } catch (error) {
    console.error('Error al guardar información de commit:', error);
  }
}

// Luego, puedes llamar a esta función para guardar la información del commit cuando encuentres un codesmell
guardarInfoCommit('nombre_repositorio', new Date(), 'hash_commit', 'nombre_committer');