import { EntityRepository } from "@tsed/typeorm";
import { Exception, Unauthorized } from "@tsed/exceptions";

import { GenericRepository } from "./generics/GenericRepository";
import { Project, Target } from "../entities";
import { AgeRange, IContext, Scope } from "../types";
import { AgeRangeEnumTransformer } from "../utils";
import { TargetRepository } from "./TargetRepository";

const relations = [
    "disclosureMedias",
    "eventPresentations",
    "evaluations",
    "futureDevelopmentPlans",
    "partners",
    "demands",
    "publications",
    "projectHumanResources",
    "projectPublics",
    "targets",
    "projectThemeAreas",
    "activities",
    "extensionLines",
    "knowledgeAreas",
    "attachments"
];

@EntityRepository(Project)
export class ProjectRepository extends GenericRepository<Project> {

    constructor(private targetRepository: TargetRepository) {
        super(relations);
    }
    
    /**
     * Return a project if user is linked to it.
     * @param context               -- user context.
     * @param id                    -- project id.
     */
    public async findByContext(id: number, context: IContext, coodinator: boolean = false): Promise<Project> {
        let query = this.createQueryBuilder("p")
            .innerJoin("p.projectHumanResources", "phr")
            .where("p.id = :id", { id });

        if (!context.scope || !context.scope.isAdmin) {
            query = query.innerJoin("phr.user", "usr", "user.id = :userId", { userId: context.user?.id });
        }

        if (coodinator) {
            query = query.where("phr.coordinator = :coordinator", { coodinator: true });
        }

        const project = await query.getOne();
        if (!project) {
            throw new Exception(404, "Project not found.");
        }

        return project;
    }

}
