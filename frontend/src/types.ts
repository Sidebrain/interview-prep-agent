type BaseMemoryInput = {
  value: string;
};

type ContextualMemoryInput = BaseMemoryInput & {
  memtype: "contextual";
  field: "rate_card" | "company_info" | "user_info";
};

type DynamicMemoryInput = BaseMemoryInput & {
  memtype: "dynamic";
  field: "short" | "long";
};

export type MemoryInput = ContextualMemoryInput | DynamicMemoryInput;
export type { ContextualMemoryInput, DynamicMemoryInput };
