// To get the user payable details where user participated
const pipeline = [
    // { $unwind: { path: "$participants" } },
    { $match: { "participants.email": req.user.email } },
    // {
    //     $group: {
    //         _id: "$groupId",
    //         participants: {
    //             $push: "$participants",
    //         },
    //     },
    // },
    {
        $lookup: {
            from: "groups",
            localField: "groupId",
            foreignField: "_id",
            pipeline: [
                {
                    $project: {
                        name: "$name",
                    },
                },
            ],
            as: "group_details",
        },
    },
    {
        $replaceRoot: {
            newRoot: {
                $mergeObjects: [
                    { groupId: "$groupId", paidBy: "$paidBy", amount: "$amount", description: "$description", groupName: { $first: "$group_details.name" } },
                    {
                        $arrayElemAt: [
                            {
                                $filter: {
                                    input: "$participants",
                                    as: "p",
                                    cond: { $eq: ["$$p.email", req.user.email] },
                                },
                            },
                            0,
                        ],
                    },
                ],
            },
        },
    },
    // $project: {
    // },
];
