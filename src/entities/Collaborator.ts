import { Property, Required } from "@tsed/common";
import { Description } from "@tsed/swagger";
import { Entity, PrimaryGeneratedColumn, Column, JoinColumn, OneToOne, OneToMany, Index } from "typeorm";

import { Audit } from "./generics/Audit";
import { User } from "./User";
import { ProjectHumanResource } from "./ProjectHumanResource";

@Entity({ name: "collaborators" })
@Index("idx_user_id", [ "user" ])
export class Collaborator extends Audit {

    @Property({ name: "id" })
    @PrimaryGeneratedColumn({ name: "id", type: "bigint", unsigned: true })
    public id!: number;
    
    @Required()
    @Description("Formação acadêmica ou função")
    @Property({ name: "academicFunction" })
    @Column({ name: "academic_function", type: "varchar", length: 255, nullable: false })
    public academicFunction: string;

    @Required()
    @Description("Registro profissional")
    @Property({ name: "profissionalRegistry" })
    @Column({ name: "profissional_registry", type: "varchar", length: 255, nullable: false })
    public profissionalRegistry: string;

    @Required()
    @Description("Forma de vínculo (CLT, Prestação de Serviço, etc.)")
    @Property({ name: "affiliation" })
    @Column({ name: "affiliation", type: "varchar", length: 255, nullable: false })
    public affiliation: string;

    @Property({ name: "user" })
    @OneToOne(() => User, (user) => user.collaborator)
    @JoinColumn({ name: "user_id", referencedColumnName: "id" })
    public user: User;

    @Property({ name: "projectHumanResources" })
    @OneToMany(() => ProjectHumanResource, (projectHumanResources) => projectHumanResources.collaborator)
    public projectHumanResources: ProjectHumanResource[];

}
