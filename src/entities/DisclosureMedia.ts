import { Property, Required, Format } from "@tsed/common";
import { Entity, PrimaryGeneratedColumn, Column, JoinColumn, ManyToOne, Index } from "typeorm";

import { Audit } from "./generics/Audit";
import { Project } from "./Project";

@Index("idx_disclosure_medias_project_id", [ "project" ])
@Entity({ name: "disclosure_medias" })
export class DisclosureMedia extends Audit {

    @Property({ name: "id" })
    @PrimaryGeneratedColumn({ name: "id", type: "bigint", unsigned: true })
    public id: number;
    
    @Required()
    @Property({ name: "name" })
    @Column({ name: "name", type: "varchar", length: 255, nullable: false })
    public name: string;

    @Required()
    @Property({ name: "link" })
    @Column({ name: "link", type: "varchar", length: 255, nullable: false })
    public link: string;

    @Required()
    @Format("date")
    @Property({ name: "date" })
    @Column({ name: "date", type: "date", nullable: false })
    public date: string;

    @Property({ name: "project" })
    @ManyToOne(() => Project, (project) => project.disclosureMedias, { nullable: false })
    @JoinColumn({ name: "project_id", referencedColumnName: "id" })
    public project: Project;

}
