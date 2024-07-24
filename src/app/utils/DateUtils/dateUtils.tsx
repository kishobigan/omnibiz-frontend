export const getLast10Days = (): string[] => {
    const result: string[] = [];
    const today = new Date();

    for (let i = 0; i < 10; i++) {
        const date = new Date(today);
        date.setDate(today.getDate() - i);
        result.push(date.getDate().toString());
    }

    return result.reverse();
};