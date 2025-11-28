export function formatCPF(cpf: string) {
    return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
}

export function formatCurrency(value: number | string) {
    return `${Number(value).toFixed(0)} moeda${Number(value) !== 1 ? 's' : ''}`;
}

export function formatDate(dateString: string | Date | undefined) {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}