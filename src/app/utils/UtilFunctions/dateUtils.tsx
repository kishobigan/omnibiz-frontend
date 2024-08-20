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

export const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
};

export const getDatesInRange = (startDate: Date, endDate: Date): string[] => {
    const dates = [];
    let currentDate = new Date(startDate);

    while (currentDate <= endDate) {
        const month = String(currentDate.getMonth() + 1).padStart(2, '0');
        const day = String(currentDate.getDate()).padStart(2, '0');
        dates.push(`${month}-${day}`);
        currentDate.setDate(currentDate.getDate() + 1);
    }

    const today = new Date();
    const todayFormatted = `${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
    if (!dates.includes(todayFormatted)) {
        dates.push(todayFormatted);
    }
    return dates;
};