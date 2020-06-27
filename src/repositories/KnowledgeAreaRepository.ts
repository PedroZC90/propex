import { EntityRepository } from "@tsed/typeorm";
import { Like } from "typeorm";

import { GenericRepository } from "./generics/GenericRepository";
import { KnowledgeArea, Project, Page } from "../entities";

import { StringUtils } from "../core/utils";

@EntityRepository(KnowledgeArea)
export class KnowledgeAreaRepository extends GenericRepository<KnowledgeArea> {

    constructor() {
        super([ "projects" ]);
    }

    /**
     * Return a paged list of all kowndledge areas saved in the database.
     * @param options                       -- query options.
     */
    public async fetch(page: number = 1, rpp: number = 15, q?: string): Promise<Page<KnowledgeArea>> {
        const params: any = {
            skip: (page - 1) * rpp,
            take: rpp
        };
        
        if (StringUtils.isNotEmpty(q)) {
            params.where = [
                { name: Like(`%${q}%`) }
            ];
        };
        return Page.of(await this.find(params), page, rpp);
    }

    /**
     * Return a list of all knowledge areas saved in the database.
     * @param options                       -- query options
     */
    public async list(options: any): Promise<KnowledgeArea[]> {
        const params: any = {};
        if (options.q) {
            params.where = [
                { name: Like(`%${options.q}%`) }
            ];
        };
        return this.find(params);
    }

    public async findManyByProject(projectId: number): Promise<KnowledgeArea[]> {
        return this.createQueryBuilder("ka")
            .innerJoin("ka.projects", "p", "p.id = :projectId", { projectId })
            .getMany();
    }

    public async findByProject(id: number, projectId: number): Promise<KnowledgeArea | undefined> {
        return this.createQueryBuilder("ka")
            .innerJoin("ka.projects", "p", "p.id = :projectId", { projectId })
            .where("ka.id = :id", { id })
            .getOne();
    }

    /**
     * Overwrite project knowledge areas, delete the items not send, and add the new items.
     * @param project                       -- project to overwrite its knowdledge areas.
     * @param knowledgeAreas                -- list of knwoledge areas (they must exists in the database).
     */
    public async overwrite(project: Project, knowledgeAreas: KnowledgeArea[]): Promise<KnowledgeArea[]> {
        // load extension lines which the project has connection.
        const savedKnowledgeAreas = await this.findManyByProject(project.id);
        
        // find kownledge areas the to deleted (elements that are saved on database but not in the received array)
        const knowledgeAreasToDelete = savedKnowledgeAreas.filter((a) => knowledgeAreas.findIndex((b) => b.id === a.id) < 0);
        if (knowledgeAreasToDelete.length > 0) {
            await this.createQueryBuilder("knowledgeAreas").relation("projects").of(knowledgeAreasToDelete).remove(project);
        }

        // find kownledge areas the to saved (elements that are not saved on database)
        const knowledgeAreasToInsert = knowledgeAreas.filter((a) => !!a.id && savedKnowledgeAreas.findIndex((b) => b.id === a.id) < 0);
        if (knowledgeAreasToInsert.length > 0) {
            await this.createQueryBuilder("knowledgeAreas").relation("projects").of(knowledgeAreasToInsert).add(project);
        }

        return this.findManyByProject(project.id);
    }
    
}
