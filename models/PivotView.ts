export interface PivotView {
        ViewName: string;
        ModuleId: number;
        FrozenColumn: string;
        PivotColumn: string;
        ValueColumn: string;
        AggregateFunction: string;
        Type: string;
        UserName: string;
        CreationDate: Date;
        Active: boolean;
}

export interface PivotDropDown {
        Text: string;
        Value: string;
}

export interface PivotAggregate {
        name: string;
        code: string;
}