import { Controller, Post } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Subject } from './subject.entity';
import { Teacher } from './teacher.entity';
// import { User } from 'src/auth/user.entity';
// import { Profile } from 'src/auth/profile.entity';

@Controller('school')
export class TrainingController {
    constructor(
        @InjectRepository(Subject)
        private readonly subjectRepository: Repository<Subject>,
        @InjectRepository(Teacher)
        private readonly teacherRepository: Repository<Teacher>,
    ) {}

    @Post('/create')
    public async savingRelation() {
        const subject = await this.subjectRepository.findOne({
            where: { id: 9 },
        });

        /* OneToOne relationship
        const user = new User();
        const profile = new Profile();
        user.profile = profile;
        user.profile = null; // remove the relationship if it's nullable (nullable by default)
        */

        const teacher1 = await this.teacherRepository.findOne({
            where: { id: 3 },
        });
        const teacher2 = await this.teacherRepository.findOne({
            where: { id: 4 },
        });

        return await this.subjectRepository
            .createQueryBuilder()
            .relation(Subject, 'teachers')
            .of(subject)
            .add([teacher1, teacher2]);
    }

    @Post('/remove')
    public async removingRelation() {
        await this.subjectRepository
            .createQueryBuilder('s')
            .update()
            .set({
                name: 'Confidential',
            })
            .execute();
    }
}
