import * as borsh from '@project-serum/borsh'

export class Introduction {
    name: string;
    introduction: string;

    constructor(name:string, introduction:string) {
        this.name = name;
        this.introduction = introduction;
    }

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

    static borshAccountSchema = borsh.struct([
        borsh.bool('initialized'),
        borsh.str('name'),
        borsh.str('introduction'),
    ])

    static deserialize (buffer?: Buffer): Introduction | null {
        if (!buffer) {
            return null;
        }
        try {
            const { name, introduction } = this.borshAccountSchema.decode(buffer)
            return new Introduction(name, introduction)
        }
        catch (e) {
            console.log('Deserialization Failed: ', e);
            return null;
        }
    }
}