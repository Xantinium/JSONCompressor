# JSONCompressor

Содержит класс JSONCompressor, реализующий преобразовние исходнных объектов посредством замены ключей на некую абстракцию.

Используемые типы:

type PrimitiveType = string | number | boolean | null;

type InputType = {
    [key: string]: PrimitiveType | InputType | (PrimitiveType | InputType)[];
} | (PrimitiveType | InputType)[];

Данный класс сожержит в себе два статических метода:

// Прямое преобразование\n
static compress(input: InputType, keys: string[]): InputType

// Обратное преобразование\n
static decompress(input: InputType, keys: string[]): InputType
