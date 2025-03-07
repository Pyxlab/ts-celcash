import { P, match } from 'ts-pattern'
import { z } from 'zod'
import { transformArrayToString } from '../utils/transform.js'
import { addressSchema } from './common.js'

export const statusCustomerSchema = z.enum([
    'active',
    'delayed',
    'inactive',
    'withoutSubscriptionOrCharge',
])

export const createCustomerBodySchema = z.object({
    myId: z.string().uuid(),
    name: z.string(),
    document: z.string().min(11).max(14),
    emails: z.array(z.string()),
    phones: z.array(z.coerce.number()).optional(),
    invoiceHoldIss: z.boolean().optional(),
    municipalDocument: z.string().optional(),
    Address: addressSchema,
})

export type CreateCustomerBody = z.input<typeof createCustomerBodySchema>

export const customerSchema = createCustomerBodySchema.extend({
    galaxPayId: z.coerce.number(),
    status: statusCustomerSchema,
    createdAt: z.string(),
    updatedAt: z.string(),
})

export const partialCustomerSchema = customerSchema
    .deepPartial()
    .refine(props =>
        match(props)
            .with(
                {
                    myId: P.nonNullable,
                    document: P.nonNullable,
                    name: P.nonNullable,
                    emails: P.nonNullable,
                },
                () => true,
            )
            .with({ galaxPayId: P.nonNullable }, () => true)
            .with({ myId: P.nonNullable }, () => true)
            .with({ document: P.nonNullable }, () => true)
            .otherwise(() => false),
    )

export const createCustomerResponseSchema = z.object({
    type: z.boolean(),
    Customer: customerSchema,
})

export type CreateCustomerResponse = z.input<
    typeof createCustomerResponseSchema
>

const listCustomersOrderEnum = z.enum([
    'createdAt.asc',
    'createdAt.desc',
    'updatedAt.asc',
    'updatedAt.desc',
])
export const listCustomersParamsSchema = z.object({
    documents: z
        .union([z.array(z.coerce.string()), z.coerce.string()])
        .optional()
        .transform(transformArrayToString),
    emails: z
        .union([z.array(z.coerce.string()), z.coerce.string()])
        .optional()
        .transform(transformArrayToString),
    createdAtFrom: z.string().optional(),
    createdAtTo: z.string().optional(),
    createdOrUpdatedFrom: z.string().optional(),
    createdOrUpdatedTo: z.string().optional(),
    myIds: z
        .union([z.array(z.coerce.string()), z.coerce.string()])
        .optional()
        .transform(transformArrayToString),
    galaxPayIds: z
        .union([z.array(z.coerce.number()), z.coerce.number()])
        .optional()
        .transform(transformArrayToString),
    startAt: z.coerce.number().optional(),
    status: z
        .enum(['active', 'delayed', 'inactive', 'withoutSubscriptionOrCharge'])
        .optional(),
    limit: z.coerce.number().min(0).max(100),
    order: z
        .union([listCustomersOrderEnum, z.array(listCustomersOrderEnum)])
        .optional()
        .transform(transformArrayToString),
})

export type ListCustomersParams = z.input<typeof listCustomersParamsSchema>

export const listCustomersResponseSchema = z.object({
    totalQtdFoundInPage: z.coerce.number(),
    Customers: z.array(customerSchema),
})

export type ListCustomersResponse = z.input<typeof listCustomersResponseSchema>
