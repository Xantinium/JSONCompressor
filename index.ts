type PrimitiveType = string | number | boolean | null;

type InputType = {
    [key: string]: PrimitiveType | InputType | (PrimitiveType | InputType)[];
} | (PrimitiveType | InputType)[];

type RelationsType = {
    [key: string]: string;
};

class JSONCompressor {

    // Функция для создания нового наименования
    private generateKey(n: number): string {
        if (n < 25) return String.fromCharCode(97 + n);
        // Использование рекурсивного вызова функции
        return `a${this.generateKey(n - 25)}`;
    }

    // Функция для создания словаря, содержащего связи между наименованиями
    private generateRelations(keys: string[], reverse: boolean): RelationsType {
        // Сортировка наименований (для однозначности)
        const sortedKeys = [...keys].sort();
        const relations: RelationsType = {};
        // Запись связей в словарь
        sortedKeys.forEach((item, index) => {
            // Обратная связь
            if (reverse) {
                relations[this.generateKey(index)] = item;
                return;
            }
            // Прямая связь
            relations[item] = this.generateKey(index);
        });
        return relations;
    }

    // Функция для преобразования массива
    private convertArray(arr: (PrimitiveType | InputType)[], relations: RelationsType): (PrimitiveType | InputType)[] {
        return arr.map((item: PrimitiveType | InputType) => {
            if (typeof item !== 'object') {
                return item;
            }
            return this.convertObject(item, relations);
        });
    }

    // Функция для преобразования структур данных с вложенностью
    private convertObject(obj: InputType, relations: RelationsType): InputType {
        if (Array.isArray(obj)) {
            return this.convertArray(obj, relations);
        }
        const newObj: InputType = {};
        for (const key in obj) {
            // Получение итерируемого наименования
            const value = obj[key];
            // Получение нового наименования для текущего
            const compressedKey = relations[key] || key;
            // Случай №1: значение является примитивом
            if (typeof value !== 'object') {
                newObj[compressedKey] = value;
                continue;
            }
            // Случай №2: значение является массивом
            if (Array.isArray(value)) {
                newObj[compressedKey] = this.convertArray(value, relations);
                continue;
            }
            // Случай №3: значение является сложной структурой
            newObj[compressedKey] = this.convertObject(value, relations);
        }
        return newObj;
    }

    // Фукнция для преобразования наименовай исходного объекта
    private transform(input: InputType, keys: string[], reverse: boolean): InputType {
        const relations = this.generateRelations(keys, reverse);
        return this.convertObject(input, relations);
    }

    // Пользовательская функия для прямого проеобразования
    static compress(input: InputType, keys: string[]): InputType {
        return this.prototype.transform(input, keys, false);
    }

    // Пользовательская функия для обратного проеобразования
    static decompress(input: InputType, keys: string[]): InputType {
        return this.prototype.transform(input, keys, true);
    }
}
