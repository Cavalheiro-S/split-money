export class TransactionAdapter {
    private value: RequestCreateTransaction;

    constructor(obj: RequestCreateTransaction) {
        this.value = obj
    }


    adapt() {
        return {
            id: "",
            amount: this.value.amount,
            description: this.value.description,
            category: this.value.category,
            date: new Date(this.value.date),
            type: this.value.type
        } as Transaction
    }
}