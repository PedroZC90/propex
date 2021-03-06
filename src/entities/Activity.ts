import { Property, Format } from "@tsed/common";
import { Entity, PrimaryGeneratedColumn, Column, ManyToMany, JoinTable, ManyToOne, JoinColumn, Index } from "typeorm";

import { Audit } from "./generics/Audit";
import { Attachment } from "./Attachment";
import { Project } from "./Project";

@Index("idx_activities_project_id", [ "project" ])
@Entity({ name: "activities" })
export class Activity extends Audit {

    @Property({ name: "id" })
    @PrimaryGeneratedColumn({ name: "id", type: "bigint", unsigned: true })
    public id: number;
    
    @Property({ name: "name" })
    @Column({ name: "name", type: "varchar", length: 255, nullable: false })
    public name: string;

    @Property({ name: "description" })
    @Column({ name: "description", type: "varchar", length: 255, nullable: false })
    public description: string;

    @Property({ name: "external" })
    @Column({ name: "external", type: "boolean", default: false, nullable: false })
    public external: boolean;

    @Property({ name: "numberOfMembers" })
    @Column({ name: "number_of_members", type: "int", width: 11, default: 0, nullable: false })
    public numberOfMembers: number;

    @Format("date")
    @Property({ name: "date" })
    @Column({ name: "date", type: "date", nullable: false })
    public date: string;

    @Property({ name: "period" })
    @Column({ name: "period", type: "int", width: 11, nullable: false })
    public period: number;

    @Property({ name: "executionWeekday" })
    @Column({ name: "execution_weekday", type: "varchar", length: 255, nullable: false })
    public executionWeekday: string;

    @Format("time")
    @Property({ name: "executionHour" })
    @Column({ name: "execution_hour", type: "time", nullable: false })
    public executionHour: string;

    @Property({ name: "results" })
    @Column({ name: "results", type: "varchar", length: 255, nullable: false })
    public results: string;

    @Property({ name: "attachments" })
    @ManyToMany(() => Attachment, (attachment) => attachment.activities, { cascade: false, persistence: false })
    @JoinTable({
        name: "activity_attachments",
        joinColumn: { name: "activity_id", referencedColumnName: "id" },
        inverseJoinColumn: { name: "attachment_id", referencedColumnName: "id" }
    })
    public attachments: Attachment[];

    @Property({ name: "project" })
    @ManyToOne(() => Project, (project) => project.activities, { nullable: false })
    @JoinColumn({ name: "project_id", referencedColumnName: "id" })
    public project: Project;

}
