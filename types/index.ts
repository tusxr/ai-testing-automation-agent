export type Repo = {
    name: string;
    owner: string;
    html_url: string;
    description: string;
    language: string;
    private_: boolean;
    updated_at: string;
    full_name: string;
    id: number;
    default_branch: string;
}

export type UserRepo = {
    id: number;
    userId: number;
    repoId: number;
    name: string;
    fullName: string;
    private: number;
    description: string;
    updatedAt: string;
    htmlUrl: string;
    owner: string;
    language: string;
    defaultBranch?: string;
}
