import React from "react";
import { Controller, useForm, type UseFormReturn } from "react-hook-form"
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldTitle,
} from "@/components/ui/field"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { language, pages, summaryType } from "@/lib/utils";
import { Checkbox } from "./ui/checkbox";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";

interface SummaryFilterProps  {
    form: UseFormReturn<{
        title: string;
        language: string;
        summaryType: string;
        pages: string;
    }, any, {
        title: string;
        language: string;
        summaryType: string;
        pages: string;
    }>
};


const SummaryFilter = ({form}:SummaryFilterProps) => {
    return (
            <FieldGroup>
                <Controller                
                    name="title"
                    control={form.control}
                    render={({ field, fieldState }) => (
                        <Field data-invalid={fieldState.invalid} className="grid gap-2">
                            <FieldLabel htmlFor="form-title">
                                Title
                            </FieldLabel>
                            <Input
                                {...field}
                                id="form-title"
                                aria-invalid={fieldState.invalid}
                                placeholder="algorithm"
                                autoComplete="off"
                            />
                            {fieldState.invalid && (
                                <FieldError errors={[fieldState.error]} />
                            )}
                        </Field>
                    )}
                />
                <Controller                
                    name="language"
                    control={form.control}
                    render={({ field, fieldState }) => (
                        <Field data-invalid={fieldState.invalid} className="grid gap-2">
                            <FieldLabel htmlFor="form-language">
                                Language
                            </FieldLabel>
                            <Select
                                name={field.name}
                                value={field.value}
                                onValueChange={field.onChange}
                                defaultValue="english"
                            >
                                <SelectTrigger 
                                    className="w-[180px]"
                                    id="form-rhf-select-language"
                                    aria-invalid={fieldState.invalid}    
                                >
                                    <SelectValue placeholder="Select language" />
                                </SelectTrigger>
                                <SelectContent>
                                    {language.map((item)=>(
                                        <SelectItem key={item.value} value={item.value}>
                                            {item.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            {fieldState.invalid && (
                                <FieldError errors={[fieldState.error]} />
                            )}
                        </Field>
                    )}
                />
                <Controller                
                    name="summaryType"
                    control={form.control}
                    render={({ field, fieldState }) => (
                        <Field data-invalid={fieldState.invalid} className="grid gap-2">
                            <FieldLabel htmlFor="form-summary-type">
                                How long should the note be?
                            </FieldLabel>
                            
                            <RadioGroup 
                                value={field.value}
                                onValueChange={field.onChange}
                                className="flex flex-row flex-wrap gap-4 rounded-lg"
                            >    
                                {summaryType.map((option) => (
                                    <FieldLabel
                                        htmlFor={`form-rhf-radio-${option.value}`}
                                        key={option.value}
                                        className="!w-fit"
                                    >
                                        <Field
                                            orientation="horizontal"
                                            className="overflow-hidden !px-3 !py-2.5 transition-all duration-100 ease-linear group-has-data-[state=checked]/field-label:!px-3"
                                            data-invalid={fieldState.invalid}
                                        >
                                            <RadioGroupItem
                                                id={`form-rhf-radio-${option.value}`}
                                                value={option.value}
                                                className="hidden"
                                            />
                                            <FieldTitle>{option.label}</FieldTitle>
                                        </Field>
                                    </FieldLabel>
                                ))}
                            </RadioGroup>            
                            {fieldState.invalid && (
                                <FieldError errors={[fieldState.error]} />
                            )}
                        </Field>
                    )}
                />
                <Controller                
                    name="pages"
                    control={form.control}
                    render={({ field, fieldState }) => (
                        <Field data-invalid={fieldState.invalid} className="grid gap-2">
                            <FieldLabel htmlFor="form-pages">
                                What pages would you like?
                            </FieldLabel>
                            <RadioGroup 
                                value={field.value}
                                onValueChange={field.onChange}
                                className="flex flex-row flex-wrap gap-4 rounded-lg"
                            >    
                                {pages.map((option) => (
                                    <FieldLabel
                                        htmlFor={`form-rhf-radio-${option.value}`}
                                        key={option.value}
                                        className="!w-fit"
                                    >
                                        <Field
                                            orientation="horizontal"
                                            className="overflow-hidden !px-3 !py-2.5 transition-all duration-100 ease-linear group-has-data-[state=checked]/field-label:!px-3"
                                            data-invalid={fieldState.invalid}
                                        >
                                            <RadioGroupItem
                                                id={`form-rhf-radio-${option.value}`}
                                                value={option.value}
                                                className="hidden"
                                            />
                                            <FieldTitle>{option.label}</FieldTitle>
                                        </Field>
                                    </FieldLabel>
                                ))}
                            </RadioGroup>            
                            {fieldState.invalid && (
                                <FieldError errors={[fieldState.error]} />
                            )}
                        </Field>
                    )}
                />
            </FieldGroup>
    )
}

export default SummaryFilter;