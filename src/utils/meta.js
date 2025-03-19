export const orderSateMeta = {
    Unassignedorder: {
        value: 2,
        label: '未派单',
    },
    Assignedorder: {
        value: 3,
        label: '已派单',
    },
    Completedorder: {
        value: 4,
        label: '已完成',
    },
    Closedorder: {
        value: 5,
        label: '已结单',
    },
};

export function metaToOptions(meta) {
    return Object.entries(meta).map(([key, value]) => {
        return {
            value: value.value,
            label: value.label,
        };
    });
}
