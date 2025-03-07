import { z } from 'zod'
import { transformArrayToString } from '../utils/transform.js'
import { mainPaymentMethodIdSchema, periodicitySchema } from './_/common.js'
import {
    antifraudSchema,
    boletoSchema,
    cardOperatorIdSchema,
    pixSchema,
} from './_/payments.js'
import { subscriptionStatusSchema } from './_/subscription.js'
import { cardSchema } from './cards.js'
import { chargesSchema } from './charges.js'
import { invoiceConfigSchema, invoiceSchema } from './common.js'
import { splitSchema } from './contract.js'
import { partialCustomerSchema } from './customers.js'
import {
    paymentMethodBoletoSchema,
    paymentMethodCreditCardSchema,
    paymentMethodPixSchema,
} from './payments.js'

const subscriptionSchema = z.object({
    myId: z.string(),
    planMyId: z.string(),
    planGalaxPayId: z.coerce.number(),
    firstPayDayDate: z.string(),
    additionalInfo: z.string().optional(),
    mainPaymentMethodId: mainPaymentMethodIdSchema,
    galaxPayId: z.coerce.number(),
    periodicity: periodicitySchema,
    paymentLink: z.string().optional(),
    value: z.coerce.number(),
    status: subscriptionStatusSchema,
    Customer: partialCustomerSchema,
    PaymentMethodCreditCard: paymentMethodCreditCardSchema.optional(),
    PaymentMethodBoleto: paymentMethodBoletoSchema.optional(),
    PaymentMethodPix: paymentMethodPixSchema.optional(),
    InvoiceConfig: invoiceConfigSchema.optional(),
})

export const transactionStatusSchema = z.enum([
    'noSend',
    'authorized',
    'captured',
    'denied',
    'reversed',
    'chargeback',
    'pendingBoleto',
    'payedBoleto',
    'notCompensated',
    'lessValueBoleto',
    'moreValueBoleto',
    'paidDuplicityBoleto',
    'pendingPix',
    'payedPix',
    'unavailablePix',
    'cancel',
    'payExternal',
    'cancelByContract',
    'free',
])

const listTransactionsOrderEnum = z.enum([
    'createdAt.asc',
    'createdAt.desc',
    'payday.asc',
    'payday.desc',
])
export const listTransactionsParamsSchema = z.object({
    myIds: z
        .union([z.array(z.coerce.string()), z.coerce.string()])
        .optional()
        .describe(
            'Ids das transações no seu sistema. Separe cada id por vírgula.',
        )
        .transform(transformArrayToString),
    galaxPayIds: z
        .union([z.array(z.coerce.number()), z.coerce.number()])
        .optional()
        .describe('Ids das transações no cel_cash. Separe cada id por vírgula.')
        .transform(transformArrayToString),
    subscriptionGalaxPayIds: z
        .union([z.array(z.coerce.number()), z.coerce.number()])
        .optional()
        .describe(
            'Subscription.galaxPayId. Id da assinatura no cel_cash. Separe cada id por vírgula.',
        )
        .transform(transformArrayToString),
    chargeMyIds: z
        .union([z.array(z.coerce.string()), z.coerce.string()])
        .optional()
        .describe(
            'Charge.myId. Id da cobrança no seu sistema. Separe cada id por vírgula.',
        )
        .transform(transformArrayToString),
    customerMyIds: z
        .union([z.array(z.coerce.string()), z.coerce.string()])
        .optional()
        .describe(
            'Customer.myId. Id do cliente no seu sistema. Separe cada id por vírgula.',
        )
        .transform(transformArrayToString),
    customerGalaxPayIds: z
        .union([z.array(z.coerce.number()), z.coerce.number()])
        .optional()
        .describe(
            'Customer.galaxPayId. Id do cliente no cel_cash. Separe cada id por vírgula.',
        )
        .transform(transformArrayToString),
    chargeGalaxPayIds: z
        .union([z.array(z.coerce.number()), z.coerce.number()])
        .optional()
        .describe(
            'Charge.galaxPayId. Id da cobrança no cel_cash. Separe cada id por vírgula.',
        )
        .transform(transformArrayToString),
    createdAtFrom: z.coerce
        .string()

        .optional()
        .describe('Data de criação inicial'),
    createdAtTo: z.coerce
        .string()

        .optional()
        .describe('Data de criação final'),
    payDayFrom: z.coerce
        .string()

        .optional()
        .describe('Data de vencimento inicial'),
    payDayTo: z.coerce
        .string()

        .optional()
        .describe('Data de vencimento final'),
    updateStatusFrom: z.coerce
        .string()

        .optional()
        .describe('Data de atualização de status inicial'),
    updateStatusTo: z.coerce
        .string()

        .optional()
        .describe('Data de atualização de status final'),
    status: z
        .union([transactionStatusSchema, z.array(transactionStatusSchema)])
        .optional()
        .describe('Status da transação. Separe cada status por vírgula.')
        .transform(transformArrayToString),
    startAt: z.coerce
        .number()

        .describe('Ponteiro inicial para trazer os registros.'),
    limit: z.coerce
        .number()
        .min(0)
        .max(100)
        .describe('Qtd máxima de registros para trazer.'),
    order: z
        .union([listTransactionsOrderEnum, z.array(listTransactionsOrderEnum)])
        .optional()
        .describe(`Ordenação do resultado. String que deverá ser montada da seguinte maneira: campoDaEntidade.tipoDeOrdem
Caso queira passar mais de uma ordenação, separar por vírgula: campoDaEntidade.tipoDeOrdem, campoDaEntidade2.tipoDeOrd`)
        .transform(transformArrayToString),
})

export const conciliationOccurrenceStatusSchema = z.enum([
    'payment',
    'canceled',
])

export const conciliationOccurrenceSchema = z.object({
    type: conciliationOccurrenceStatusSchema,
    liquidValue: z.coerce.number(),
    depositDate: z.string(),
    taxValue: z.coerce.number(),
    taxPercent: z.coerce.number(),
    bankName: z.string(),
    bankNumber: z.coerce.number(),
    agency: z.string(),
    account: z.string(),
})

export const abecsReasonDeniedSchema = z.object({
    code: z.string().length(4),
    message: z.string(),
})

export const transactionsSchema = z.object({
    myId: z.string().uuid(),
    galaxPayId: z.coerce.number(),
    chargeMyId: z.string().uuid(),
    chargeGalaxPayId: z.coerce.number(),
    subscriptionMyId: z.string().uuid(),
    subscriptionGalaxPayId: z.coerce.number(),
    value: z.coerce.number(),
    payday: z.string(),
    payedOutsideGalaxPay: z.boolean(),
    additionalInfo: z.string().optional(),
    installment: z.coerce.number(),
    paydayDate: z.string(),
    reasonDenied: z.string().optional(),
    authorizationCode: z.string().optional(),
    tid: z.string().optional(),
    statusDate: z.string(),
    cardOperatorId: cardOperatorIdSchema,
    AbecsReasonDenied: abecsReasonDeniedSchema,
    datetimeLastSentToOperator: z.string(),
    status: transactionStatusSchema,
    fee: z.coerce.number(),
    statusDescription: z.string(),
    Antifraud: antifraudSchema,
    ConciliationOccurrences: z.array(conciliationOccurrenceSchema),
    Invoice: invoiceSchema,
    Boleto: boletoSchema,
    Pix: pixSchema,
    Charge: z.array(chargesSchema),
    Subscription: subscriptionSchema,
    CreditCard: z.object({
        Card: cardSchema,
    }),
})

export const listTransactionsResponseSchema = z.object({
    totalQtdFoundInPage: z.coerce.number(),
    Transactions: z.array(transactionsSchema),
})

export const createTransactionBodySchema = z.object({
    myId: z.string().uuid(),
    value: z.coerce.number(),
    payday: z.string(),
    payedOutsideGalaxPay: z.boolean(),
    additionalInfo: z.string().optional(),
    PaymentMethodCreditCard: paymentMethodCreditCardSchema,
    InvoiceConfig: invoiceConfigSchema.optional(),
})

export const createOrUpdateTransactionResponseSchema = z.object({
    type: z.boolean(),
    Transaction: createTransactionBodySchema.extend({
        galaxPayId: z.coerce.number(),
        subscriptionMyId: z.string().uuid().optional(),
        subscriptionGalaxPayId: z.coerce.number().optional(),
        statusDate: z.string(),
        status: transactionStatusSchema,
        datetimeLastSentToOperator: z.string(),
        fee: z.coerce.number(),
        Invoice: invoiceSchema,
        ConciliationOccurrences: z.array(conciliationOccurrenceSchema),
        statusDescription: z.string(),
        tid: z.string(),
        authorizationCode: z.string(),
        reasonDenied: z.string().optional(),
        Boleto: boletoSchema,
        AbecsReasonDenied: abecsReasonDeniedSchema,
        cardOperatorId: cardOperatorIdSchema,
        Antifraud: antifraudSchema,
        CreditCard: z.object({
            Card: cardSchema,
        }),
    }),
    Split: splitSchema,
})

export type CreateOrUpdateTransactionResponse = z.input<
    typeof createOrUpdateTransactionResponseSchema
>

export const updateTransactionBodySchema = createTransactionBodySchema
    .pick({
        myId: true,
        value: true,
        payday: true,
        payedOutsideGalaxPay: true,
        additionalInfo: true,
    })
    .deepPartial()
    .required({ myId: true })

export type UpdateTransactionBody = z.input<typeof updateTransactionBodySchema>

export const addTransactionBodySchema = z.object({
    myId: z.coerce
        .string()
        .uuid()
        .describe('Id referente no seu sistema, para salvar na cel_cash'),
    value: z.coerce
        .number()

        .optional()
        .describe(
            'Valor a ser cobrado. Caso não seja informado, será considerado o valor da assinatura',
        ),
    payday: z.coerce
        .string()

        .optional()
        .describe(`Data de vencimento do pagamento
Caso não for passado, será calculada automaticamente pela data da último pagamento e periodicidade da assinatura.
Se for a primeira transação da assinatura, irá pegar o valor definido em Subscription.firstPayDayDate.`),
    payedOutsideGalaxPay: z
        .boolean()
        .optional()
        .describe('Indica se a transação foi paga fora do cel_cash'),
    PaymentMethodCreditCard: paymentMethodCreditCardSchema,
    InvoiceConfig: invoiceConfigSchema,
})

export const retryOrReverseTransactionResponseSchema = z.object({
    Transaction: transactionsSchema,
    PaymentMethodCreditCard: paymentMethodCreditCardSchema,
})
