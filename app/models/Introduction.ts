import * as borsh from '@project-serum/borsh'

export class Introduction {
    name: string;
    introduction: string;
    date: number;

    constructor(name:string, introduction:string) {
        this.name = name;
        this.introduction = introduction;
    }

    static mocks: Introduction[] = [
        new Introduction('Jenny', 'Helli I am Jenny, i liek cookies', Date.now()),
        new Introduction('Claas', 'Im Claas, I like to farm', Date.now()),
        new Introduction('John Deere', 'I like Green and stuff', Date.now()),
        new Introduction('Anonymous 9gagger', 'Emma Watson is my queen', Date.now()),
    ]

    borschInstructionSchema = borsh.struct([
        borsh.u8('variant'),
        borsh.str('name'),
        borsh.str('introduction'),
    ])

    serialize (): Buffer {
        const buffer = Buffer.alloc(1000)
        this.borschInstructionSchema.encode({...this, variant:0}, buffer);
        return buffer.slice(0, this.borschInstructionSchema.getSpan(buffer))
    }
}