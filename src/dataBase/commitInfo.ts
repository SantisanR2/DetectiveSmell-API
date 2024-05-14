import mongoose, { Schema, Document } from 'mongoose';

export interface ICommitInfo extends Document {
  repository: string;
  commitDate: Date;
  commitHash: string;
  committer: string;
}

const CommitInfoSchema: Schema = new Schema({
  repository: { type: String, required: true },
  commitDate: { type: Date, required: true },
  commitHash: { type: String, required: true },
  committer: { type: String, required: true },
});

const CommitInfo = mongoose.model<ICommitInfo>('CommitInfo', CommitInfoSchema);

export default CommitInfo;