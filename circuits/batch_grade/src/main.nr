// Batch grade circuit: takes 100 bureau scores as private input,
// outputs 100 grade values as public output.
//
// Grade thresholds:
//   score >= 900 -> 5 (AA)
//   800 <= score < 900 -> 4 (A)
//   650 <= score < 800 -> 3 (B)
//   500 <= score < 650 -> 2 (C)
//   300 <= score < 500 -> 1 (D)
//   score < 300 -> 0 (E)

fn grade_score(score: u32) -> u32 {
    if score >= 900 {
        5
    } else if score >= 800 {
        4
    } else if score >= 650 {
        3
    } else if score >= 500 {
        2
    } else if score >= 300 {
        1
    } else {
        0
    }
}

fn main(bureau_scores: [Field; 100], expected_grades: pub [Field; 100]) {
    for i in 0..100 {
        let score = bureau_scores[i] as u32;
        let grade = grade_score(score);
        assert(expected_grades[i] == grade as Field);
    }
}

#[test]
fn test_aa_boundary() {
    let mut scores = [0 as Field; 100];
    let mut grades = [0 as Field; 100];
    scores[0] = 900;
    grades[0] = 5;
    main(scores, grades);
}

#[test]
fn test_a_boundary() {
    let mut scores = [0 as Field; 100];
    let mut grades = [0 as Field; 100];
    scores[0] = 800;
    grades[0] = 4;
    main(scores, grades);
}

#[test]
fn test_just_below_aa() {
    let mut scores = [0 as Field; 100];
    let mut grades = [0 as Field; 100];
    scores[0] = 899;
    grades[0] = 4;
    main(scores, grades);
}

#[test]
fn test_b_boundary() {
    let mut scores = [0 as Field; 100];
    let mut grades = [0 as Field; 100];
    scores[0] = 650;
    grades[0] = 3;
    main(scores, grades);
}

#[test]
fn test_c_boundary() {
    let mut scores = [0 as Field; 100];
    let mut grades = [0 as Field; 100];
    scores[0] = 500;
    grades[0] = 2;
    main(scores, grades);
}

#[test]
fn test_d_boundary() {
    let mut scores = [0 as Field; 100];
    let mut grades = [0 as Field; 100];
    scores[0] = 300;
    grades[0] = 1;
    main(scores, grades);
}

#[test]
fn test_e_sentinel() {
    let mut scores = [0 as Field; 100];
    let mut grades = [0 as Field; 100];
    // score 0 -> grade 0 (E)
    main(scores, grades);
}
