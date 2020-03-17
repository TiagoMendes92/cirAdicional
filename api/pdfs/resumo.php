<?php
  require('fpdf.php');
  date_default_timezone_set("Europe/Lisbon");
  $user =json_decode($_POST['user']);
  $episodios =json_decode($_POST['episodios']);
  $dataInicio = $_POST['dataInicio'];
  $dataFim = $_POST['dataFim'];
  $blocoNome = $_POST['blocoNome'];
  $servico = $_POST['servico'];
  $doente = $_POST['doente'];
  $intervenienteN_MEC = $_POST['intervenienteN_MEC'];
  $intervenienteNOME = $_POST['intervenienteNOME'];
  $gdh = $_POST['gdh'];

    include_once  $_SERVER['DOCUMENT_ROOT'] . DIRECTORY_SEPARATOR . 'api' . DIRECTORY_SEPARATOR . 'dbclass.php';

  $dbclass = new DBClass();


  $nrEpisodios = sizeof($episodios) + 1;
  $pdf = new FPDF('L','mm','A4');
  $pdf->AddPage();
  $pdf->Image( $dbclass->getimagesLink().'huc.jpg', 10, 10, 50);
  $pdf->SetFont('Arial','B',12);
  $pdf->SetXY(100, 15); 
  $pdf->Write(0, utf8_decode("Centro Hospitalar e Universitário de Coimbra, EPE"));

  $pdf->SetFont('Arial','B', 8);
  $pdf->SetXY(250, 10); 
  $pdf->Write(0,"Data:");
  $pdf->SetFont('Arial', '', 8);
  $pdf->SetXY(258, 10); 

  $pdf->Write(0, date("Y-m-d")); 
  $pdf->SetFont('Arial','B', 8);
  $pdf->SetXY(250, 14); 
  $pdf->Write(0,"Hora:");
  $pdf->SetFont('Arial', '', 8);
  $pdf->SetXY(258, 14); 
  $pdf->Write(0, date('H:i:s')); 

  $pdf->SetFont('Arial','B', 8);
  $pdf->SetXY(250, 18); 
  $pdf->Write(0,"Utilizador:");
  $pdf->SetFont('Arial', '', 8);
  $pdf->SetXY(265, 18); 
  $pdf->Write(0, utf8_decode($user->user)); 

  $pdf->SetFont('Arial','B', 8);
  $pdf->SetXY(250, 22); 
  $pdf->Write(0, utf8_decode("Página:"));
  $pdf->SetFont('Arial', '', 8);
  $pdf->SetXY(261, 22); 
  $pdf->Write(0, utf8_decode("1 de ".$nrEpisodios)); 

  $pdf->SetFont('Arial','B',10);
  $pdf->SetXY(10, 30); 
  $pdf->Write(0, utf8_decode("Listagem de Registo Operatório em Programa Adicional"));
  $pdf->SetFont('Arial','B',12);
  $pdf->SetXY(10, 50); 
  $pdf->Write(0, utf8_decode("Parâmetros da Listagem"));

  $pdf->SetFont('Arial','B',10);
  $pdf->SetXY(10, 60); 
  $pdf->Write(0, utf8_decode("Data:"));
  $pdf->SetFont('Arial','',10);
  $pdf->SetXY(20, 60); 
  $pdf->Write(0, utf8_decode($dataInicio."  -  ". $dataFim));

  $pdf->SetFont('Arial','B',10);
  $pdf->SetXY(10, 67); 
  $pdf->Write(0, utf8_decode("Bloco:"));
  $pdf->SetFont('Arial','',10);
  $pdf->SetXY(22, 67); 
  $pdf->Write(0, utf8_decode($blocoNome));

  $pdf->SetFont('Arial','B',10);
  $pdf->SetXY(10, 74); 
  $pdf->Write(0, utf8_decode("Serviço:"));
  $pdf->SetFont('Arial','',10);
  $pdf->SetXY(24, 74); 
  $pdf->Write(0, utf8_decode($servico));

  $pdf->SetFont('Arial','B',10);
  $pdf->SetXY(10, 81); 
  $pdf->Write(0, utf8_decode("T_Doente:"));
  $pdf->SetFont('Arial','',10);
  $pdf->SetXY(28, 81); 
  $pdf->Write(0, utf8_decode("HUC"));

  $pdf->SetFont('Arial','B',10);
  $pdf->SetXY(10, 88); 
  $pdf->Write(0, utf8_decode("Doente:"));
  $pdf->SetFont('Arial','',10);
  $pdf->SetXY(24, 88); 
  $pdf->Write(0, utf8_decode($doente));

  $pdf->SetFont('Arial','B',10);
  $pdf->SetXY(10, 95); 
  $pdf->Write(0, utf8_decode("Interveniente (Nº MEC):"));
  $pdf->SetFont('Arial','',10);
  $pdf->SetXY(50, 95); 
  $pdf->Write(0, utf8_decode($intervenienteN_MEC));

  $pdf->SetFont('Arial','B',10);
  $pdf->SetXY(10, 102); 
  $pdf->Write(0, utf8_decode("Interveniente (Nome):"));
  $pdf->SetFont('Arial','',10);
  $pdf->SetXY(48, 102); 
  $pdf->Write(0, utf8_decode($intervenienteNOME));

  $pdf->SetFont('Arial','B',10);
  $pdf->SetXY(10, 109); 
  $pdf->Write(0, utf8_decode("GDH:"));
  $pdf->SetFont('Arial','',10);
  $pdf->SetXY(20, 109); 
  $pdf->Write(0, utf8_decode($gdh));
  $nrPag = 1;
  foreach ($episodios as $episodio) {
    $nrPag++;
    $pdf->AddPage();
    $pdf->Image($dbclass->getimagesLink().'huc.jpg', 10, 10, 50);
    $pdf->SetFont('Arial','B',12);
    $pdf->SetXY(100, 15); 
    $pdf->Write(0, utf8_decode("Centro Hospitalar e Universitário de Coimbra, EPE"));

    $pdf->SetFont('Arial','B', 8);
    $pdf->SetXY(250, 10); 
    $pdf->Write(0,"Data:");
    $pdf->SetFont('Arial', '', 8);
    $pdf->SetXY(258, 10); 

    $pdf->Write(0, date("Y-m-d")); 
    $pdf->SetFont('Arial','B', 8);
    $pdf->SetXY(250, 14); 
    $pdf->Write(0,"Hora:");
    $pdf->SetFont('Arial', '', 8);
    $pdf->SetXY(258, 14); 
    $pdf->Write(0, date('H:i:s')); 

    $pdf->SetFont('Arial','B', 8);
    $pdf->SetXY(250, 18); 
    $pdf->Write(0,"Utilizador:");
    $pdf->SetFont('Arial', '', 8);
    $pdf->SetXY(265, 18); 
    $pdf->Write(0, utf8_decode($user->user)); 

    $pdf->SetFont('Arial','B', 8);
    $pdf->SetXY(250, 22); 
    $pdf->Write(0, utf8_decode("Página:"));
    $pdf->SetFont('Arial', '', 8);
    $pdf->SetXY(261, 22); 
    $pdf->Write(0, utf8_decode($nrPag." de ".$nrEpisodios)); 

    $pdf->SetFont('Arial','B',10);
    $pdf->SetXY(10, 30); 
    $pdf->Write(0, utf8_decode("Listagem de Registo Operatório em Programa Adicional"));
    $pdf->SetFillColor(230, 230, 230);
    $pdf->Rect(10,35,275,8, 'FD');

    $pdf->SetFont('Arial','B', 10);
    $pdf->SetXY(12, 39); 
    $pdf->Write(0,"Doente:");
    $pdf->SetFont('Arial', '', 10);
    $pdf->SetXY(26, 39); 
    $pdf->Write(0, utf8_decode($episodio->nome)); 

    $pdf->SetFont('Arial','B', 10);
    $pdf->SetXY(170, 39); 
    $pdf->Write(0,"Dt. Estado:");
    $pdf->SetFont('Arial', '', 10);
    $pdf->SetXY(189, 39); 
    $pdf->Write(0, ($episodio->data_estado != NULL ? $episodio->data_estado : 'Indefinida') ); 

    $pdf->SetFont('Arial','B', 10);
    $pdf->SetXY(210, 39); 
    $pdf->Write(0, ($episodio->estado == 0 ? 'Pendente de Secretariado': $episodio->estado == 1 ? 'Pendente de GDH' :  $episodio->estado == 2 ? 'Pendente de Pagamento' : $episodio->estado == 3 ? 'Enviado para Pagamento' : 'Pagamento Processado' ));

    //PRIMEIRA LINHA
    $pdf->SetFont('Arial','B', 10);
    $pdf->SetXY(12, 47); 
    $pdf->Write(0,"Dt. Cirurgia:");
    $pdf->SetFont('Arial', '', 10);
    $pdf->SetXY(34, 47); 
    $pdf->Write(0, $episodio->dta_cirurgia ); 

    $pdf->SetFont('Arial','B', 10);
    $pdf->SetXY(103.6, 47); 
    $pdf->Write(0,utf8_decode("Dt. Admissão:"));
    $pdf->SetFont('Arial', '', 10);
    $pdf->SetXY(128, 47); 
    $pdf->Write(0, $episodio->dta_admissao ); 

    $pdf->SetFont('Arial','B', 10);
    $pdf->SetXY(195.6, 47); 
    $pdf->Write(0,utf8_decode("Dt. Alta:"));
    $pdf->SetFont('Arial', '', 10);
    $pdf->SetXY(210, 47); 
    $pdf->Write(0, $episodio->dta_alta); 

    //SEGUNDA LINHA
    $pdf->SetFont('Arial','B', 10);
    $pdf->SetXY(12, 52); 
    $pdf->Write(0,utf8_decode("Serviço:"));
    $pdf->SetFont('Arial', '', 10);
    $pdf->SetXY(27, 52); 
    $pdf->Write(0, utf8_decode($episodio->serviceName) ); 

    $pdf->SetFont('Arial','B', 10);
    $pdf->SetXY(103.6, 52); 
    $pdf->Write(0, "Bloco:");
    $pdf->SetFont('Arial', '', 10);
    $pdf->SetXY(116, 52); 
    $pdf->Write(0, utf8_decode($episodio->blocoName) ); 

    $pdf->SetFont('Arial','B', 10);
    $pdf->SetXY(195.6, 52); 
    $pdf->Write(0,utf8_decode("Tipo. Cir:"));
    $pdf->SetFont('Arial', '', 10);
    $pdf->SetXY(212, 52); 
    $pdf->Write(0, utf8_decode($episodio->tipo_cirurgia)); 

    //TERCEIRA LINHA
    $pdf->SetFont('Arial','B', 10);
    $pdf->SetXY(12, 57); 
    $pdf->Write(0,utf8_decode("GDH Estat:"));
    $pdf->SetFont('Arial', '', 10);
    $pdf->SetXY(32, 57); 
    $pdf->Write(0, ($episodio->gdh1 != NULL ? $episodio->gdh1 : 'Indefinido') ); 


    $gdh;
    if($episodio->gdhToPay == NULL){
      $gdh = NULL;
    } else {
      $gdh = $episodio->gdhToPay;
    }

    $pdf->SetFont('Arial','B', 10);
    $pdf->SetXY(103.6, 57); 
    $pdf->Write(0, "GDH 1:");
    $pdf->SetFont('Arial', '', 10);
    $pdf->SetXY(117, 57); 
    $pdf->Write(0, ($gdh == NULL ? 'Indefinido' : $gdh->gdh . " - " . utf8_decode($gdh->desc) ." - ". number_format(($gdh->v_uni * $gdh->perc / 100), 2, '.', '') . chr(128) )); 

    //DIAGNOSTICOS
    $pdf->SetFillColor(230, 230, 230);
    $pdf->Rect(10, 62, 135, 8,  'FD');
    $pdf->SetFont('Arial','B', 10);
    $pdf->SetXY(12, 66); 
    $pdf->Write(0, utf8_decode("Diagnósticos"));

    $dy = 70;
    foreach ($episodio->diagnosticos as $diagnostico) {
      $pdf->Rect(10, $dy, 135, 7);
      $pdf->SetFont('Arial','B', 10);
      $pdf->SetXY(12, $dy + 3.5); 
      $pdf->Write(0, utf8_decode($diagnostico->sigla));
      $pdf->SetFont('Arial','', 10);
      $pdf->SetXY(24, $dy + 3.5); 
      $pdf->Write(0,  utf8_decode(substr($diagnostico->nome, 0, 60)) . (strlen($diagnostico->nome) > 60 ? '...' : ''));
      $dy+=7;
    }

    $iy=70;
    //INTERVENCOES
    $pdf->SetFillColor(230, 230, 230);
    $pdf->Rect(150, 62, 135, 8,  'FD');
    $pdf->SetFont('Arial','B', 10);
    $pdf->SetXY(152, 66); 
    $pdf->Write(0, utf8_decode("Intervenções"));
    foreach ($episodio->intervencoes as $intervencao) {
      $pdf->Rect(150, $iy, 135, 7);
      $pdf->SetFont('Arial','B', 10);
      $pdf->SetXY(152, $iy + 3.5); 
      $pdf->Write(0, utf8_decode($intervencao->sigla));
      $pdf->SetFont('Arial','', 10);
      $pdf->SetXY(174, $iy + 3.5); 
      $pdf->Write(0,  utf8_decode(substr($intervencao->nome, 0, 60)) . (strlen($intervencao->nome) > 60 ? '...' : ''));
      $iy+=7;
    }

    $biggest;
    if($iy > $dy){
      $biggest = $iy;
    } else {
      $biggest = $dy;
    }
    $biggest+=5;

    if($biggest > 150){
      $pdf->AddPage();
      $biggest = 10;
    }

    //EQUIPA CIRURGICA
    $pdf->SetFillColor(230, 230, 230);
    $pdf->Rect(10, $biggest, 275, 8,  'FD');
    $pdf->SetFont('Arial','B', 10);
    $pdf->SetXY(12, $biggest + 4); 
    $pdf->Write(0, utf8_decode("Equipa Cirúrgica"));
    $biggest+=8;
    $countEC = 0;
    foreach ($episodio->intervenientes as $interveniente) {
      $funcao = $interveniente->funcao;
      if($funcao->equipa == 'EC'){
        $countEC++;
        $pdf->Rect(10, $biggest, 275, 7);
        $pdf->SetFont('Arial','B', 10);
        $pdf->SetXY(12, $biggest + 3.5); 
        $pdf->Write(0, utf8_decode($interveniente->id_prof));
        $pdf->SetFont('Arial','', 10);
        $pdf->SetXY(27, $biggest + 3.5); 
        $pdf->Write(0, utf8_decode(substr($interveniente->nome, 0, 33)) . (strlen($interveniente->nome) > 33 ? '...' : ''));
        $pdf->SetFont('Arial','B', 10);
        $pdf->SetXY(110, $biggest + 3.5); 
        $pdf->Write(0, utf8_decode("Função:"));
        $pdf->SetFont('Arial','', 10);
        $pdf->SetXY(127, $biggest + 3.5); 
        $pdf->Write(0, utf8_decode($funcao->sigla) . " - " . utf8_decode($funcao->funcao));
        $pdf->SetFont('Arial','B', 10);
        $pdf->SetXY(220, $biggest + 3.5); 
        $pdf->Write(0, utf8_decode("Perc:"));
        $pdf->SetFont('Arial','', 10);
        $pdf->SetXY(230, $biggest + 3.5); 
        $pdf->Write(0, $funcao->perc . " %");
        $pdf->SetFont('Arial','B', 10);
        $pdf->SetXY(250, $biggest + 3.5); 
        $pdf->Write(0, "Valor:");
        $pdf->SetFont('Arial','', 10);
        $pdf->SetXY(262, $biggest + 3.5); 
        $pdf->Write(0, number_format(($gdh->v_uni * $gdh->perc / 100 * $funcao->perc / 100), 2, '.', ''). " ".chr(128));
        $biggest+=7;
      }
    }
    if($countEC == 0){
      $pdf->Rect(10, $biggest, 275, 7);
      $pdf->SetFont('Arial','', 10);
      $pdf->SetXY(12, $biggest + 3.5); 
      $pdf->Write(0, utf8_decode("Nenhum Elemento na Equia Cirúrugica"));
      $biggest+=7;
    }

    $biggest+=5;

    if($biggest > 150){
      $pdf->AddPage();
      $biggest = 10;
    }
    
    //EQUIPA APOIO
    $pdf->SetFillColor(230, 230, 230);
    $pdf->Rect(10, $biggest, 275, 8,  'FD');
    $pdf->SetFont('Arial','B', 10);
    $pdf->SetXY(12, $biggest + 4); 
    $pdf->Write(0, utf8_decode("Equipa de Apoio"));
    $biggest+=8;
    $countEA = 0;
    foreach ($episodio->intervenientes as $interveniente) {
      $funcao = $interveniente->funcao;
      if($funcao->equipa == 'EA'){
        $countEA++;
        $pdf->Rect(10, $biggest, 275, 7);
        $pdf->SetFont('Arial','B', 10);
        $pdf->SetXY(12, $biggest + 3.5); 
        $pdf->Write(0, utf8_decode($interveniente->id_prof));
        $pdf->SetFont('Arial','', 10);
        $pdf->SetXY(27, $biggest + 3.5); 
        $pdf->Write(0, utf8_decode(substr($interveniente->nome, 0, 33)) . (strlen($interveniente->nome) > 33 ? '...' : ''));    $pdf->SetFont('Arial','B', 10);
        $pdf->SetXY(110, $biggest + 3.5); 
        $pdf->Write(0, utf8_decode("Função:"));
        $pdf->SetFont('Arial','', 10);
        $pdf->SetXY(127, $biggest + 3.5); 
        $pdf->Write(0, utf8_decode($funcao->sigla) . " - " . utf8_decode($funcao->funcao));
        $pdf->SetFont('Arial','B', 10);
        $pdf->SetXY(220, $biggest + 3.5); 
        $pdf->Write(0, utf8_decode("Perc:"));
        $pdf->SetFont('Arial','', 10);
        $pdf->SetXY(230, $biggest + 3.5); 
        $pdf->Write(0, $funcao->perc . " %");
        $pdf->SetFont('Arial','B', 10);
        $pdf->SetXY(250, $biggest + 3.5); 
        $pdf->Write(0, "Valor:");
        $pdf->SetFont('Arial','', 10);
        $pdf->SetXY(262, $biggest + 3.5); 
        $pdf->Write(0, number_format(($gdh->v_uni * $gdh->perc / 100 * $funcao->perc / 100), 2, '.', ''). " ".chr(128));
        $biggest+=7;
      }
    }
    if($countEA == 0){
      $pdf->Rect(10, $biggest, 275, 7);
      $pdf->SetFont('Arial','', 10);
      $pdf->SetXY(12, $biggest + 3.5); 
      $pdf->Write(0, utf8_decode("Nenhum Elemento na Equia de Apoio"));
    }

  }
  $nome = 'Resumo_'.($dataInicio != '' ? 'desde_'.$dataInicio.'_' : '').($dataFim != '' ? 'ate_'.$dataFim:'').'.pdf';
  $pdf->Output("F",$dbclass->getoutputPDF().$nome); 
  echo json_encode('api/generatedPDFS/'.$nome);