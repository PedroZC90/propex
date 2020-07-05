import { isBoolean } from "@tsed/core";
import { EntityRepository } from "@tsed/typeorm";

import { GenericRepository } from "./generics/GenericRepository";
import { Student, Project } from "../entities";
import { IOptions } from "../core/types";

import { StringUtils } from "../core/utils";

interface StudentOptions extends IOptions {
    id?: number;
    scholarship?: boolean;
    coordinate?: boolean;
    exclusive?: boolean;
    period?: string;
    project?: Project;
    projectId?: number;
}

@EntityRepository(Student)
export class StudentRepository extends GenericRepository<Student> {

    /**
     * Return a list of students.
     * @param options                       -- query options.
     */
    public async fetch(params: StudentOptions): Promise<Student[]> {
        const page = params.page;
        const rpp = params.rpp;

        const query = this.createQueryBuilder("std")
            .innerJoinAndSelect("std.user", "usr")
            .innerJoinAndSelect("usr.projectHumanResources", "phr");
            
        if (params.project || params.projectId) {
            const projectId = params.projectId || params.project?.id;
            query.innerJoin("phr.project", "p", "p.id = :projectId", { projectId });
        }
        
        if (isBoolean(params.scholarship)) {
            query.andWhere("std.scholarship = :scholarship", { scholarship: (params.scholarship) ? 1 : 0 });
        }

        if (isBoolean(params.exclusive)) {
            query.andWhere("phr.exclusive = :exclusive", { exclusive: (params.exclusive) ? 1 : 0 });
        }

        // NÃO FUNCIONA (???)
        if (params.period) {
            query.andWhere("std.period = :period", { period: params.period });
        }

        if (StringUtils.isNotEmpty(params.q)) {
            query.orWhere("std.code LIKE :code", { code: `%${params.q}%` })
                .orWhere("std.course LIKE :course", { course: `%${params.q}%` })
                .orWhere("usr.name LIKE :name", { name: `%${params.q}%` });
        }

        if (page && rpp) {
            query.skip((page - 1) * rpp).take(rpp);
        }

        return query.getMany();
    }

}
