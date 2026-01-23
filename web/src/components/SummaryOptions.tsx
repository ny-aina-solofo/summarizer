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
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";

interface SummaryOptionsProps  {
    form: UseFormReturn<{
        title: string;
        language: string;
        summaryType: string;
        pagesOptions: string,
        pagesRange? : string
    }, any, {
        title: string;
        language: string;
        summaryType: string;
        pagesOptions: string,
        pagesRange? : string
    }>
};


const SummaryOptions = ({form}:SummaryOptionsProps) => {
    const pagesOption = form.watch("pagesOptions");
    const isCustom = pagesOption === "custom";
    
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
                    name="pagesOptions"
                    control={form.control}
                    render={({ field, fieldState }) => (
                        <Field data-invalid={fieldState.invalid} className="grid gap-2">
                        <FieldLabel>What pages would you like?</FieldLabel>

                        <div className="flex flex-row gap-4 flex-wrap">
                            {/* Radios */}
                            <RadioGroup
                                value={field.value}
                                onValueChange={field.onChange}
                                className="flex gap-4"
                            >
                            {pages.map((option) => (
                                <FieldLabel
                                    key={option.value}
                                    className="!w-fit cursor-pointer"
                                >
                                    <Field
                                        orientation="horizontal"
                                        className="overflow-hidden !px-3 !py-2.5 transition-all duration-100 ease-linear group-has-data-[state=checked]/field-label:!px-3"
                                    >
                                        <RadioGroupItem
                                            value={option.value}
                                            className="hidden"
                                        />
                                        <FieldTitle>{option.label}</FieldTitle>
                                    </Field>
                                </FieldLabel>
                            ))}
                            </RadioGroup>

                            {/* Input pagesRange */}
                            <Controller
                                name="pagesRange"
                                control={form.control}
                                rules={{
                                    validate: (value) =>
                                    !isCustom || value?.trim()
                                        ? true
                                        : "Please specify page ranges",
                                }}
                                render={({ field, fieldState }) => (
                                    <div className="flex flex-col">
                                        <Input
                                            {...field}
                                            placeholder="1-5, 7-10"
                                            disabled={!isCustom}
                                            className="w-40 h-10 overflow-hidden "
                                            aria-invalid={fieldState.invalid}
                                        />
                                        {fieldState.invalid && (
                                            <FieldError errors={[fieldState.error]} />
                                        )}
                                    </div>
                                )}
                            />
                        </div>

                        {fieldState.invalid && (
                            <FieldError errors={[fieldState.error]} />
                        )}
                        </Field>
                    )}
                />

            </FieldGroup>
    )
}

export default SummaryOptions;